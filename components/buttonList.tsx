import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function ButtonList({
  listItems = [],
  isSimple = true,
}: {
  listItems: IListItems[];
  isSimple?: boolean;
}) {
  if (isSimple === false && listItems.length > 3)
    return <ComplexButtonListContent listItems={listItems} />;
  else return <SimpleButtonListContent listItems={listItems} />;
}

function SimpleButtonListContent({ listItems }: { listItems: IListItems[] }) {

  return (
    <View className="flex flex-col gap-2 py-2">
      {listItems.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-2"
            onPress={item.onAction}
          >
            <View className={"flex-row items-center flex "}>
              <View
                className={`flex items-center justify-center rounded-lg p-[2px] ${item.itemColor || "bg-muted"}`}
              >
                <Ionicons
                  className=""
                  name={item.icon}
                  size={24}
                  color="white"
                />
              </View>

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
  const firstPart = listItems.slice(0, 3);
  const secondPart = listItems.slice(3);

  return (
    <View className="flex flex-col gap-2 py-2">
      {firstPart.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-2 "
            onPress={item.onAction}
          >
            <View className="flex flex-row items-center ">
              <View
                className={`flex items-center justify-center rounded-lg p-[2px] ${item.itemColor || "bg-muted"}`}
              >
                <Ionicons
                  className=""
                  name={item.icon}
                  size={24}
                  color="white"
                />
              </View>

              <Text className="ml-2 text-white ">{item.text}</Text>
            </View>
            <Text className="ml-2 text-right text-white">{item.kpi}</Text>
          </TouchableOpacity>
        );
      })}
      <Collapsible>
        <CollapsibleTrigger>
          <View className="flex-row items-center justify-between">
            <View
              className={cn(
                "flex items-center flex-row justify-center rounded-md p-[2px] "
              )}
            >
              <Ionicons className="" name={"menu"} size={24} color="white" />

              <Text className="ml-2 text-white">{"More"}</Text>
            </View>
            <Ionicons name="arrow-down" />
          </View>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {secondPart.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between py-2 "
                onPress={item.onAction}
              >
                <View className="flex flex-row items-center">
                  <View
                    className={`flex items-center justify-center rounded-lg p-[2px] ${item.itemColor || "bg-muted"}`}
                  >
                    <Ionicons
                      className=""
                      name={item.icon}
                      size={24}
                      color="white"
                    />
                  </View>

                  <Text className="ml-2 text-white ">{item.text}</Text>
                </View>
                <Text className="ml-2 text-right text-white">{item.kpi}</Text>
              </TouchableOpacity>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </View>
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
