import { Flex, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { ProviderCard } from "../components";
import { stage$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const stage = Array.from(stage$.providers.get().values());

  return (
    <Flex
      align="center"
      gap="4"
      justify="center"
      className="h-screen w-full px-8"
    >
      {/* {stage.length === 0 && (
        <Flex align="center" justify="center" direction="column">
          <Heading size="6">The Stage is Empty</Heading>
          <Text size="3" color="gray">
            Add your apps to get started
          </Text>
        </Flex>
      )} */}
      {stage.map((provider) => (
        <ProviderCard provider={provider} key={provider} />
      ))}
      {stage.length === 1 && (
        <Flex className="w-2/6" align="center" justify="center">
          <Text>Add one more to get started</Text>
        </Flex>
      )}
    </Flex>
  );
}
