import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import { Text } from "@/components/ui/text";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import { RoundedColoredButton } from "./RoundedColored";

export function ButtonList({
  listItems = [],
  isSimple = true,
}: {
  listItems: IListItems[];
  isSimple?: boolean;
}) {
  if (isSimple === false && listItems?.length > 3)
    return <ComplexButtonListContent listItems={listItems} />;
  else return <SimpleButtonListContent listItems={listItems} />;
}

function SimpleButtonListContent({ listItems }: { listItems: IListItems[] }) {

  return (
    <View className="flex flex-col gap-2 py-2">
      {listItems?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-2"
            onPress={item.onAction}
          >
            <View className={"flex-row items-center flex "}>
              <RoundedColoredButton button={item} />
              <Text
                className="ml-2 text-white"
                testID={`${item.text}-button`}
              >{item.text}

              </Text>
            </View>
            <Text className="ml-2 text-right text-white">{item.kpi}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
function ComplexButtonListContent({ listItems }: { listItems: IListItems[] }) {
  const firstPart = listItems?.slice(0, 3);
  const secondPart = listItems?.slice(3);

  return (
    <View className="flex flex-col gap-2 py-2">
      {firstPart.map((button, index) => {
        return (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-2 "
            onPress={button.onAction}
          >
            <View className="flex flex-row items-center ">
              <RoundedColoredButton button={button} size="sm" />
              <Text className="ml-2 text-white ">{button.text}</Text>
            </View>
            <Text className="ml-2 text-right text-white">{button.kpi}</Text>
          </TouchableOpacity>
        );
      })}
      <Collapsible>
        <CollapsibleTrigger>
          <View className="flex-row items-center justify-between">
            <View
              className="flex flex-row items-center justify-center"
            >
              <RoundedColoredButton button={{
                icon: "menu",
                text: "More",
                // screen: "/workspace/issues/list",
                itemColor: "#000",
              }} size="md" />
              <Text className="ml-2 text-white ">More</Text>
            </View>
            <Ionicons name="arrow-down" color="white" />
          </View>
        </CollapsibleTrigger >
        <CollapsibleContent>
          {secondPart.map((button, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between py-2 "
                onPress={button.onAction}
              >
                <View className="flex flex-row items-center">
                  <RoundedColoredButton button={button} size="sm" />

                  <Text className="ml-2 text-white ">{button.text}</Text>
                </View>
                <Text className="ml-2 text-right text-white">{button.kpi}</Text>
              </TouchableOpacity>
            );
          })}
        </CollapsibleContent>
      </Collapsible >
    </View >
  );
}

export interface IListItems {
  icon?: any;
  text?: string;
  link?: string;
  itemColor?: string;
  kpi?: number | string;
  onAction?: () => void;
}
