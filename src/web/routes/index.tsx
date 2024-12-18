import { Button, Flex, Heading, Select, Text } from "@radix-ui/themes";
import { capitalize, findProviderIcon } from "@shared/utils";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "../components";
import { authenticated$, stage$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mutate: attemptOAuth } = t.oauth.attemptOAuth.useMutation();

  const stage = Array.from(stage$.providers.get().values());

  return (
    <Flex align="center" gap="5" justify="center" className="h-screen w-full">
      {stage.length === 0 && (
        <Flex align="center" justify="center" direction="column">
          <Heading size="7">The Stage is Empty</Heading>
          <Text size="3" color="gray">
            Add your apps to get started
          </Text>
        </Flex>
      )}
      {stage.map((provider) => (
        <Flex
          direction="column"
          className="w-2/6 h-4/6 shadow shadow-sm bg-white dark:bg-neutral-800 border-1 border-solid border-neutral-400/10 dark:border-neutral-700 rounded-md"
          key={`${provider}__`}
        >
          <Flex
            width="100%"
            align="center"
            justify="between"
            className="h-[11%] px-2 dark:border-b-neutral-100/8 border-b-neutral-300/20 border-b-1 border-b-solid"
          >
            <Flex
              direction="column"
              gap="1"
              className="bg-neutral-600/5 p-1 rounded-md cursor-pointer shadow shadow-sm"
            >
              <img
                src={findProviderIcon(provider)}
                className="w-5 h-5"
                alt={`${provider}_logo`}
              />
            </Flex>
            <Flex align="center" justify="end" gap="1">
              <Select.Root size="1">
                <Select.Trigger />
                <Select.Content
                  defaultValue={stage.length === 1 ? "source" : ""}
                  variant="soft"
                >
                  <Select.Item value="source">Source</Select.Item>
                  <Select.Item value="destination">Destination</Select.Item>
                </Select.Content>
              </Select.Root>
              {!authenticated$.providers.has(provider) && (
                <>
                  <Button
                    onClick={() => attemptOAuth({ provider })}
                    className="cursor-pointer"
                    size="1"
                    variant="outline"
                  >
                    <Text>authenticate</Text>
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
          <Flex grow="1" width="100%" justify="between" direction="column">
            <Flex grow="1" className="px-2 py-2">
              <Text size="3" color="gray">
                My {capitalize(provider)}
              </Text>
            </Flex>
            <Flex width="100%" align="center" justify="end">
              <button
                onClick={() => stage$.providers.delete(provider)}
                className="text-neutral-400 flex items-center justify-center space-x-1 py-2 px-2"
              >
                <Icon name="X" size={12} />
              </button>
            </Flex>
          </Flex>
        </Flex>
      ))}
      {stage.length === 1 && (
        <Flex className="w-2/6" align="center" justify="center">
          <Text>Add one more to get started</Text>
        </Flex>
      )}
    </Flex>
  );
}
