import { useObservable } from "@legendapp/state/react";
import { Button, Flex, Select, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { capitalize, findProviderIcon } from "@src/shared/utils";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback } from "react";
import { authenticated$, transferState$ } from "../state";
import Icon from "./icon";

type Props = {
  provider: Provider;
};

const ProviderCard = memo(({ provider }: Props) => {
  const { mutate: attemptOAuth } = t.oauth.attemptOAuth.useMutation();

  const isExpanded = useObservable(false);
  const isExpandedValue = isExpanded.get();

  const transferState = transferState$.providers.get();

  console.log(transferState);

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

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpandedValue ? "66.666667%" : "8%",
      }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-50/80 overflow-hidden shadow shadow-sm border-1 border-solid border-neutral-400/10 w-3/6 rounded-md"
    >
      <Flex
        className="px-2 py-3 fixed w-89"
        gap="3"
        align="center"
        justify="between"
      >
        <Flex align="center" gap="2">
          <img
            src={findProviderIcon(provider)}
            alt={`${provider}__logo`}
            className="w-5 h-5"
          />
          <Text size="2" weight="bold">
            {capitalize(provider)}
          </Text>
        </Flex>
        <Flex align="center" justify="end" gap="3">
          {!authenticated$.providers.has(provider) && (
            <Button
              size="1"
              className="cursor-pointer"
              variant="soft"
              onClick={() => attemptOAuth({ provider })}
            >
              <Text>Connect Account</Text>
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
        </Flex>
      </Flex>
      <AnimatePresence initial={false} mode="wait" presenceAffectsLayout>
        {isExpandedValue && (
          <motion.div
            initial={{ opacity: 0, height: "0%" }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ opacity: 0 }}
            className="w-full pt-10"
            transition={{ duration: 0.5 }}
          >
            <Flex
              grow="1"
              direction="column"
              className="w-full h-full px-2 py-2"
            >
              <Flex width="100%" align="center" justify="between">
                <Text size="2">My {capitalize(provider)} Library</Text>
                <Select.Root
                  onValueChange={(value) => addToTransferState(value as State)}
                  size="1"
                  defaultValue="source"
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
  // return (
  //   <Flex
  //     direction="column"
  //     className="w-3/6 h-4/6 shadow shadow-sm bg-white dark:bg-neutral-800 border-1 border-solid border-neutral-400/10 dark:border-neutral-700 rounded-md"
  //   >
  //     <Flex
  //       width="100%"
  //       align="center"
  //       justify="between"
  //       className="h-[11%] px-2 dark:border-b-neutral-100/8 border-b-neutral-300/20 border-b-1 border-b-solid"
  //     >
  //       <Flex
  //         direction="column"
  //         gap="1"
  //         className="bg-neutral-900/6 p-1 rounded-md cursor-pointer shadow shadow-sm"
  //       >
  //         <img
  //           src={findProviderIcon(provider)}
  //           className="w-5.5 h-5.5"
  //           alt={`${provider}_logo`}
  //         />
  //       </Flex>
  //       <Flex align="center" justify="end" gap="1">
  //         <Select.Root
  //           onValueChange={(value) => addToTransferState(value as State)}
  //           size="1"
  //         >
  //           <Select.Trigger className="cursor-pointer" variant="soft" />
  //           <Select.Content variant="soft">
  //             <Select.Item value="source">Source</Select.Item>
  //             <Select.Item value="destination">Destination</Select.Item>
  //           </Select.Content>
  //         </Select.Root>
  //         {!authenticated$.providers.has(provider) && (
  //           <>
  //             <Button
  //               onClick={() => attemptOAuth({ provider })}
  //               className="cursor-pointer"
  //               size="1"
  //               variant="soft"
  //             >
  //               <Text weight="bold">Connect Account</Text>
  //             </Button>
  //           </>
  //         )}
  //       </Flex>
  //     </Flex>
  //     <Flex grow="1" width="100%" justify="between" direction="column">
  //       <Flex grow="1" className="px-2 py-2">
  //         <Text size="3" color="gray">
  //           My {capitalize(provider)}
  //         </Text>
  //       </Flex>
  //       <Flex width="100%" align="center" justify="end">
  //         <button
  //           onClick={() => stage$.providers.delete(provider)}
  //           className="text-neutral-400 flex items-center justify-center space-x-1 py-2 px-2"
  //         >
  //           <Icon name="X" size={12} />
  //         </button>
  //       </Flex>
  //     </Flex>
  //   </Flex>
  // );
});

export default ProviderCard;
