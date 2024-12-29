import {
  Button,
  Checkbox,
  Flex,
  ScrollArea,
  Select,
  Text,
} from "@radix-ui/themes";
import t from "@src/shared/config";
import { capitalize, findProviderIcon } from "@src/shared/utils";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import { appState, stage, transfers } from "../state";
import Icon from "./icon";
import Spinner from "./spinner";

type Props = {
  provider: Provider;
};

const ProviderCard = memo(({ provider }: Props) => {
  const { mutate, isLoading } = t.oauth.attemptOAuth.useMutation();

  const [isExpanded, setIsExpanded] = useState(false);

  const transferState = transfers.use.providers();
  const _stage = stage.use.providers();
  const authenticated = appState.use.authenticatedProviders();
  const addAuthenticatedProvider = appState.use.addAuthenticatedProviders();

  const [selectedPlayLists, setSelectedPlaylists] = useState(new Set<string>());

  const { data, isLoading: gettingYTPlaylist } =
    t.youtube.getPlaylists.useQuery(undefined, {
      enabled: provider === "youtube" && authenticated && isExpanded,
    });

  const memoAuth = useCallback(
    (provider: Provider) => mutate({ provider }),
    [mutate],
  );

  const addToTransferState = useCallback(
    (state: State) => {
      if (transferState.has(provider)) {
        const v = transferState.get(provider);
        if (v === state) return;
        transferState.delete(provider);
        transferState.set(provider, state);
      }

      transferState.set(provider, state);

      return;
    },
    [transferState, provider],
  );

  const selectPlaylist = useCallback(
    (title: string) =>
      setSelectedPlaylists((selectedPlayLists) => selectedPlayLists.add(title)),
    [],
  );

  const removeProviderFromStage = useCallback(() => {
    _stage.delete(provider);
    return;
  }, [provider, _stage]);

  t.oauth.awaitOAuthAttempt.useSubscription(undefined, {
    onData: (data) => {
      addAuthenticatedProvider(data.provider, data.successful);
    },
  });

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? "68%" : "9.5%",
      }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden relative shadow shadow-sm border-1 border-solid border-neutral-400/10 w-3/6 rounded-lg"
    >
      <Flex
        className="px-2 py-3 absolute top-0 left-0 w-full bg-white dark:bg-neutral-950 border-b-neutral-200/9 dark:border-b-neutral-600/20 border-b-solid border-b-1"
        gap="3"
        align="center"
        justify="between"
      >
        <Flex align="center" gap="2">
          <Flex className="bg-neutral-500/10 dark:bg-neutral-700/35 rounded-md p-1 border-1 border-neutral-300/20 border-solid">
            <img
              src={findProviderIcon(provider)}
              alt={`${provider}__logo`}
              className="w-5.5 h-5.5"
            />
          </Flex>
          <Text size="2" weight="bold">
            {capitalize(provider)}
          </Text>
        </Flex>
        <Flex align="center" justify="end" gap="2">
          {!authenticated.has(provider) && (
            <Button
              size="1"
              className="cursor-pointer"
              variant="soft"
              color="gray"
              onClick={() => memoAuth(provider)}
            >
              <Text weight="bold">Connect Account</Text>
              {isLoading && <Spinner size={4} />}
            </Button>
          )}
          <Button
            size="1"
            className="cursor-pointer"
            variant="soft"
            onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
          >
            <motion.div
              animate={{
                rotateZ: isExpanded ? "180deg" : "360deg",
              }}
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={11} />
            </motion.div>
          </Button>
          <Button
            onClick={removeProviderFromStage}
            variant="soft"
            className="cursor-pointer"
            size="1"
          >
            <Icon name="X" size={11} />
          </Button>
        </Flex>
      </Flex>
      <AnimatePresence initial={false} mode="wait" presenceAffectsLayout>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: "0%" }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ opacity: 0 }}
            className="w-full mt-10 pt-3 grow-1 bg-neutral-50/80 dark:bg-neutral-900"
            transition={{ duration: 0.5 }}
          >
            <Flex
              grow="1"
              direction="column"
              className="w-full h-full px-2 py-2"
            >
              <Flex
                width="100%"
                align="center"
                className="mt-1"
                justify="between"
              >
                <Text weight="bold" size="2">
                  My {capitalize(provider)} Library
                </Text>
                <Select.Root
                  onValueChange={(value) => addToTransferState(value as State)}
                  size="1"
                >
                  <Select.Trigger variant="soft" />
                  <Select.Content color="gray" variant="soft">
                    <Select.Item className="cursor-pointer" value="source">
                      Source
                    </Select.Item>
                    <Select.Item className="cursor-pointer" value="destination">
                      Destination
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              {gettingYTPlaylist && (
                <Flex
                  grow="1"
                  align="center"
                  className="w-full h-full"
                  justify="center"
                  direction="column"
                  gap="1"
                >
                  <Spinner size={22} />
                  <Text size="1" color="gray">
                    Getting your playlists
                  </Text>
                </Flex>
              )}
              <ScrollArea className="mt-2">
                {data?.playlists?.map((list, idx) => (
                  <Flex
                    key={`${list.title}__${idx}`}
                    align="center"
                    justify="between"
                    className="py-1"
                  >
                    <Text size="2">{list.title}</Text>
                    <Checkbox
                      defaultChecked={selectedPlayLists.has(list.title!)}
                      onCheckedChange={(e) => selectPlaylist(list.title!)}
                      variant="soft"
                      onClick={() => selectPlaylist(list.title!)}
                    />
                  </Flex>
                ))}
              </ScrollArea>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ProviderCard;
