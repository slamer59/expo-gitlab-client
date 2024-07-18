
import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function ImageViewer() {
  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold">Image Viewer</Text>
      <View className="w-4/5 h-px my-6 bg-gray-300 dark:bg-gray-700" />
    </View>
  );
}

{/* 
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:gitplus_for_gitlab/modules/image_viewer/image_viewer.dart';
import 'package:gitplus_for_gitlab/shared/shared.dart';

class ImageViewerScreen extends GetView<ImageViewerController> {
  const ImageViewerScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Scaffold(
        appBar: AppBar(title: Text(controller.file.value.fileName!)),
        body: HttpFutureBuilder(
          state: controller.state.value,
          child: SafeArea(child: controller.widget),
        ),
      ),
    );
  }
}

*/}
