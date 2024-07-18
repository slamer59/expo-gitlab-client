
import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function Starrers() {
  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold">Starrers</Text>
      <View className="w-4/5 h-px my-6 bg-gray-300 dark:bg-gray-700" />
    </View>
  );
}

{/* 
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:gitplus_for_gitlab/shared/shared.dart';

import 'package:get/get.dart';

import 'starrers.dart';

class StarrersScreen extends GetView<StarrersController> {
  const StarrersScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Obx(() => _buildWidget());
  }

  Widget _buildWidget() {
    return Scaffold(
      appBar: AppBar(
        title: Text("Starrers".tr),
      ),
      body: RefreshIndicator(
        onRefresh: () => controller.list(),
        child: HttpFutureBuilder(
          state: controller.state.value,
          child: Scrollbar(
            controller: controller.scrollController,
            child: ListView.builder(
                controller: controller.scrollController,
                physics: const AlwaysScrollableScrollPhysics(),
                itemCount: controller.starrers.length,
                itemBuilder: (context, index) {
                  var item = controller.starrers[index];

                  return Column(
                    children: [
                      ListTile(
                        leading: CircleAvatar(
                          child: CachedNetworkImage(
                            imageUrl: item.user!.avatarUrl!,
                            imageBuilder: (context, imageProvider) => Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(50),
                                image: DecorationImage(
                                  image: imageProvider,
                                ),
                              ),
                            ),
                          ),
                        ),
                        title: Text(item.user!.name ?? ''),
                        subtitle: Text(item.user!.username ?? ''),
                      ),
                      const Divider(),
                    ],
                  );
                }),
          ),
        ),
      ),
    );
  }
}

*/}
