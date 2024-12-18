import { Icon } from "@components/index";
import { Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import t from "@shared/config";
import { capitalize, providers } from "@src/shared/utils";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { useCallback, useEffect } from "react";
import { globalState$, stage$ } from "../state";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const colorMode = globalState$.colorMode.get();

  const stage = Array.from(stage$.providers.get().values());

  const addProviderToStage = useCallback(
    (provider: Provider) => {
      if (stage.length === 2 && !stage$.providers.has(provider)) {
        console.log("max reached");
        return;
      }

      if (stage$.providers.has(provider)) {
        stage$.providers.delete(provider);
        return;
      }
      stage$.providers.add(provider);
      return;
    },
    [stage],
  );

  useEffect(() => {
    if (globalState$.colorMode.get() === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={true} presenceAffectsLayout>
      <Flex
        width="100%"
        direction="column"
        id={colorMode === "dark" ? "darkspace" : "lightspace"}
        grow="1"
        className="transition"
      >
        <Flex
          align="center"
          justify="between"
          width="100%"
          className="absolute px-3 py-2"
        >
          <Flex
            id="drag-region"
            grow="1"
            align="center"
            justify="center"
            direction="row"
            p="3"
          />
          <Flex align="center" justify="end" gap="4">
            <button
              className="text-neutral-600"
              onClick={() => minimizeWindow()}
            >
              <Icon name="Minus" size={10} />
            </button>
            <button onClick={() => closeWindow()} className="text-red-600">
              <Icon name="X" size={10} />
            </button>
          </Flex>
        </Flex>
        {children}
        <Flex
          align="center"
          justify="start"
          gap="3"
          className="absolute bottom-3 left-3"
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                size="1"
                variant="soft"
                className="cursor-pointer"
                color="gray"
              >
                <Text>Select a Provider</Text>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="1" variant="soft" color="gray">
              {providers.map((provider) => (
                <DropdownMenu.CheckboxItem
                  className="cursor-pointer"
                  checked={!!stage$.providers.has(provider.provider)}
                  onClick={() => addProviderToStage(provider.provider)}
                  key={`${provider.provider}`}
                >
                  <Flex align="center" justify="start" gap="2">
                    <img
                      src={provider.img}
                      className="w-2 h-2"
                      alt={`${provider.provider}`}
                    />
                    <Text size="1" color="gray">
                      {capitalize(provider.provider)}
                    </Text>
                  </Flex>
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>
    </AnimatePresence>
  );
}
