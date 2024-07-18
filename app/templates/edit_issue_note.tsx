
import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function EditIssueNote() {
  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold">Edit Issue Note</Text>
      <View className="w-4/5 h-px my-6 bg-gray-300 dark:bg-gray-700" />
    </View>
  );
}

{/* 
import 'package:flutter/material.dart';
import 'package:gitplus_for_gitlab/shared/shared.dart';

import 'package:get/get.dart';

import 'edit_issue_note.dart';

class EditIssueNoteScreen extends GetView<EditIssueNoteController> {
  const EditIssueNoteScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Obx(() => _buildWidget(context));
  }

  Widget _buildWidget(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit comment'.tr),
        actions: [
          IconButton(
              onPressed: () {
                controller.delete(context);
              },
              tooltip: 'Delete comment',
              icon: const Icon(Icons.delete_outline))
        ],
      ),
      body: SafeArea(child: _buildForm(context)),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          controller.save();
        },
        child: const Icon(Icons.save),
        tooltip: 'Save'.tr,
      ),
    );
  }

  Widget _buildForm(context) {
    return Form(
      key: controller.registerFormKey,
      child: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(15.0),
              child: MultilineInputField(
                context: context,
                labelText: "Content".tr,
                controller: controller.bodyController,
              ),
            ),
            const SizedBox(height: 100)
          ],
        ),
      ),
    );
  }
}

*/}
