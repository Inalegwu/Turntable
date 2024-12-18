import { Button, Flex, Heading, Select, Text } from "@radix-ui/themes";
import { capitalize, findProviderIcon } from "@shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "../components";
import { stage$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const stage = stage$.providers.get();

  return (
    <Flex align="center" gap="5" justify="center" className="h-screen w-full">
      {stage.length === 0 && (
        <Flex align="center" justify="center" direction="column">
          <Heading size="7">The Stage is Empty</Heading>
          <Text size="3" color="gray">
            Add providers to begin transfer
          </Text>
        </Flex>
      )}
      {stage.map((provider) => (
        <Flex
          direction="column"
          className="w-2/6 h-4/6 shadow shadow-sm bg-white dark:bg-neutral-100/1 border-1 border-solid border-neutral-400/10 dark:border-neutral-100/10 rounded-md"
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
              className="bg-neutral-600/10 p-1 rounded-md cursor-pointer"
            >
              <img
                src={findProviderIcon(provider)}
                className="w-5 h-5"
                alt={`${provider}_logo`}
              />
            </Flex>
            <Flex align="center" justify="end" gap="1">
              <Select.Root size="1">
                <Select.Trigger>
                  <button>Priority</button>
                </Select.Trigger>
                <Select.Content variant="soft">
                  <Select.Item value="source">Source</Select.Item>
                  <Select.Item value="destination">Destination</Select.Item>
                </Select.Content>
              </Select.Root>
              <Button className="cursor-pointer" size="1" variant="outline">
                <Text>authenticate</Text>
              </Button>
            </Flex>
          </Flex>
          <Flex grow="1" width="100%" justify="between" direction="column">
            <Flex grow="1" className="px-2 py-2">
              <Text size="2" color="gray">
                My {capitalize(provider)}
              </Text>
            </Flex>
            <Flex width="100%" align="center" justify="end">
              <button
                onClick={() =>
                  stage$.providers.filter((f) => f.get() === provider)
                }
                className="text-neutral-400 flex items-center justify-center space-x-2 py-1 px-1"
              >
                <Text size="1">Remove</Text>
                <Icon name="X" size={12} />
              </button>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}
