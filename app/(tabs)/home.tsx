import { Ionicons } from '@expo/vector-icons'; // You can use any icon library you prefer
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ButtonList = () => {
  const buttons = [
    { icon: 'alert-circle-outline', text: 'Issues' },
    { icon: 'git-merge', text: 'Merge Requests' },
    { icon: 'chatbubbles-outline', text: 'Discussions' },
    { icon: 'folder-outline', text: 'Projects' },
    { icon: 'folder-open-outline', text: 'Repositories' },
    { icon: 'people-outline', text: 'Organizations' },
    { icon: 'star-outline', text: 'Starred' },
  ];

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Workspace</Text>
        {buttons.map((button, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            <Ionicons name={button.icon} size={24} color="black" />
            <Text style={styles.buttonText}>{button.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.container}>
        <Text style={styles.headerText}>Favorites</Text>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
          <Text style={styles.buttonText}>New Favorite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.headerText}>Shortcuts</Text>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
          <Text style={styles.buttonText}>New Shortcut</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {

  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f0f0f0', // Light gray background color
    borderRadius: 8,
    margin: 16,
    // Add some margin to the container
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow


  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    color: 'black',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  }
});

export default ButtonList;
