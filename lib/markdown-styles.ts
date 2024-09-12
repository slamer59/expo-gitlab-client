import { Platform } from 'react-native';

// this is converted to a stylesheet internally at run time with StyleSheet.create(
// https://github.com/iamacup/react-native-markdown-display
export const styles = {
  // The main container
  body: {
    color: '#fff',
  },

  // Headings
  heading1: {
    flexDirection: 'row',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  heading2: {
    flexDirection: 'row',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  heading3: {
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  heading4: {
    flexDirection: 'row',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  heading5: {
    flexDirection: 'row',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  heading6: {
    flexDirection: 'row',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Horizontal Rule
  hr: {
    backgroundColor: '#000000',
    height: 1,
  },

  // Emphasis
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },

  // Blockquotes
  blockquote: {
    color: "#fff",
    backgroundColor: '#000',
    borderColor: '#fff',
    borderLeftWidth: 4,
    marginLeft: 5,
    paddingHorizontal: 5,
  },

  // Lists
  bullet_list: {},
  ordered_list: {},
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_content: {
    flex: 1,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_content: {
    flex: 1,
  },

  // Code
  code_inline: {
    color: '#000',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#A9A9A9',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
  },
  code_block: {
    color: '#000',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
  },
  fence: {
    color: "#000",
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Courier',
      },
      ['android']: {
        fontFamily: 'monospace',
      },
    }),
  },

  // Tables
  table: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
  },
  thead: { borderColor: '#fff' },
  tbody: { borderColor: '#fff' },
  th: {
    flex: 1,
    padding: 5,
    borderColor: '#fff',
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: 5,
    borderColor: '#fff',
  },

  // Links
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: '#000000',
    borderBottomWidth: 1,
  },

  // Images
  image: {
    flex: 1,
  },

  // Text Output
  text: {},
  textgroup: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
};