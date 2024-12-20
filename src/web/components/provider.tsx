import { useObservable } from "@legendapp/state/react";
import { Button, Flex, Select, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { capitalize, findProviderIcon } from "@src/shared/utils";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback } from "react";
import { authenticated$, stage$, transferState$ } from "../state";
import Icon from "./icon";
import Spinner from "./spinner";

type Props = {
  provider: Provider;
};

const ProviderCard = memo(({ provider }: Props) => {
  const { mutate: attemptOAuth, isLoading } = t.oauth.attemptOAuth.useMutation(
    {},
  );

  const isExpanded = useObservable(false);
  const isExpandedValue = isExpanded.get();

  const transferState = transferState$.providers.get();

  console.log(transferState);

  const memoAuth = useCallback(
    (provider: Provider) => attemptOAuth({ provider }),
    [attemptOAuth],
  );

  const addToTransferState = useCallback(
    (state: State) => {
      if (transferState.has(provider)) {
        const v = transferState$.providers.get(provider);
        if (v.get() === state) return;
        transferState$.providers.delete(provider);
        transferState$.providers.set(provider, state);
      }

      transferState$.providers.set(provider, state);

      return;
    },
    [transferState, provider],
  );

  const removeProviderFromStage = () => {
    stage$.providers.delete(provider);
    return;
  };

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpandedValue ? "68%" : "9%",
      }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden relative shadow shadow-sm border-1 border-solid border-neutral-400/10 w-3/6 rounded-md"
    >
      <Flex
        className="px-2 py-3 absolute top-0 left-0 w-full bg-white border-b-neutral-200/9 border-b-solid border-b-1"
        gap="3"
        align="center"
        justify="between"
      >
        <Flex align="center" gap="2">
          <Flex className="bg-neutral-500/10 rounded-md p-1 border-1 border-neutral-300/20 border-solid">
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
          {!authenticated$.providers.has(provider) && (
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
            onClick={() => isExpanded.set(!isExpandedValue)}
          >
            <Icon
              name={isExpandedValue ? "ChevronUp" : "ChevronDown"}
              size={11}
            />
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
        {isExpandedValue && (
          <motion.div
            initial={{ opacity: 0, height: "0%" }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ opacity: 0 }}
            className="w-full mt-10 pt-3 bg-neutral-50/80"
            transition={{ duration: 0.5 }}
          >
            <Flex
              grow="1"
              direction="column"
              className="w-full h-full px-2 py-2"
            >
              <Flex width="100%" align="center" justify="between">
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
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ProviderCard;
