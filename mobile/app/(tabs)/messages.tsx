import { CONVERSATIONS, ConversationType } from "@/data/conversations";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Message screen
const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");

  // hardcoded data
  // conversation list state
  const [conversationsList, setConversationsList] = useState(CONVERSATIONS);
  // selected conversations states
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  // boolean chat is open
  const [isChatOpen, setIsChatOpen] = useState(false);
  // new message state
  const [newMessage, setNewMessage] = useState("");

  // delete conversation
  const deleteConversation = (conversationId: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConversationsList((prev) =>
              prev.filter((conv) => conv.id !== conversationId)
            );
          },
        },
      ]
    );
  };
  // open conversation
  const openConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  // close chat modal
  const closeChatModal = () => {
    // reset chat open function
    setIsChatOpen(false);
    setSelectedConversation(null);
    setNewMessage("");
  };
  // send message function
  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // update last message in conversation
      setConversationsList((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: newMessage, time: "now" }
            : conv
        )
      );
      setNewMessage("");
      // after sent message
      Alert.alert(
        "Message Sent!",
        `Your message has been sent to ${selectedConversation.user.name}`
      );
    }
  };

  return (
    // safe area only included to the top
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        {/* Edit button layout in header */}
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#73C883" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#73C883" />
          {/* Text input in search bar */}
          <TextInput
            // place holder before user type something in the search bar
            placeholder="Search for people and groups"
            className="flex-1 ml-3 text-base"
            // color of the place holder
            placeholderTextColor="#657786"
            // state
            value={searchText}
            // setter function
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* CONVERSATIONS LIST */}

      {/* scrollable conversation list */}
      <ScrollView
        className="flex-1"
        // delete vertical indicator
        showsVerticalScrollIndicator={false}
        // position conversation list into safe area
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* return conversations */}
        {conversationsList.map((conversation) => (
          // conversation as a button
          <TouchableOpacity
            key={conversation.id}
            // layout of each conversation
            className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
            // press action
            onPress={() => openConversation(conversation)}
            // delete when a user presses and holds down on an element for a predefined duration
            onLongPress={() => deleteConversation(conversation.id)}
          >
            {/* image of the other user's */}
            <Image
              source={{ uri: conversation.user.avatar }}
              className="size-12 rounded-full mr-3"
            />

            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-1">
                  <Text className="font-semibold text-gray-900">
                    {/* username of the other user's */}
                    {conversation.user.name}
                  </Text>

                  {/* verified sign of a verifed user */}
                  {conversation.user.verified && (
                    // check-circle sign
                    <Feather
                      name="check-circle"
                      size={16}
                      color="#73C883"
                      className="ml-1"
                    />
                  )}
                  {/* conversation text preview */}
                  <Text className="text-gray-500 text-sm ml-1">
                    @{conversation.user.username}
                  </Text>
                </View>
                {/* latest time of a conversation */}
                <Text className="text-gray-500 text-sm">
                  {conversation.time}
                </Text>
              </View>
              {/* last message of a conversation */}
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions */}
      {/* an explanation on the bottom */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-gray-500 text-center">
          Tap to open • Long press to delete
        </Text>
      </View>

      {/* scroll up when a conversation is selected */}
      <Modal
        visible={isChatOpen}
        // animation slide when chat is open
        animationType="slide"
        // page sheet style
        presentationStyle="pageSheet"
      >
        {/* render conversation in the page sheet */}
        {selectedConversation && (
          <SafeAreaView className="flex-1">
            {/* Chat Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              {/* click arrow left button to close chat modal */}
              <TouchableOpacity onPress={closeChatModal} className="mr-3">
                {/* left arrow button */}
                <Feather name="arrow-left" size={24} color="#73C883" />
              </TouchableOpacity>

              {/* image of the other user's in the conversation */}
              <Image
                source={{ uri: selectedConversation.user.avatar }}
                className="size-10 rounded-full mr-3"
              />

              <View className="flex-1">
                <View className="flex-row items-center">
                  {/* conversation */}
                  <Text className="font-semibold text-gray-900 mr-1">
                    {selectedConversation.user.name}
                  </Text>
                  {/* verified sign of the verifed user */}
                  {selectedConversation.user.verified && (
                    <Feather name="check-circle" size={16} color="#73C883" />
                  )}
                </View>
                <Text className="text-gray-500 text-sm">
                  @{selectedConversation.user.username}
                </Text>
              </View>
            </View>

            {/* Chat Messages Area */}
            {/* scrollable messages in the list */}
            <ScrollView className="flex-1 px-4 py-4">
              <View className="mb-4">
                {/* TOP SECTION */}
                <Text className="text-center text-gray-400 text-sm mb-4">
                  {/* when conversation is very top, shows this message */}
                  This is the beginning of your conversation with{" "}
                  {/* the name of the other user's in the conversation on the top*/}
                  {selectedConversation.user.name}
                </Text>

                {/* CONVERSATION SECTION */}
                {selectedConversation.messages.map((message) => (
                  <View
                    key={message.id}
                    // layout of the other user's message
                    className={`flex-row mb-3 ${message.fromUser ? "justify-end" : ""}`}
                  >
                    {/* the other user's profile image */}
                    {!message.fromUser && (
                      <Image
                        source={{ uri: selectedConversation.user.avatar }}
                        className="size-8 rounded-full mr-2"
                      />
                    )}
                    {/* my message is on the right, other users' on the left */}
                    <View
                      className={`flex-1 ${message.fromUser ? "items-end" : ""}`}
                    >
                      <View
                        // Message layout: my message is green, other user's message is gray
                        className={`rounded-2xl px-4 py-3 max-w-xs ${
                          message.fromUser ? "bg-green-500" : "bg-gray-100"
                        }`}
                      >
                        {/* Text layout: white text is mine, black text is the other user's */}
                        <Text
                          className={
                            message.fromUser ? "text-white" : "text-gray-900"
                          }
                        >
                          {/* render message text */}
                          {message.text}
                        </Text>
                        {/* render message time */}
                      </View>
                      <Text className="text-xs text-gray-400 mt-1">
                        {message.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Message Input */}
            {/* using keyboard avoiding view to not hide text input with keyboard */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              // IOS, gives: 60 px between text input and keyboard, android:0
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if you have a header
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-end">
                  {/* You would also render your message list above here */}

                  {/* Message Input */}
                  <View className="flex-row items-center px-4 py-3 border-t border-gray-100 bg-white">
                    <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3">
                      <TextInput
                        className="flex-1"
                        placeholder="Start a message..."
                        placeholderTextColor="#657786"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                        style={{
                          
                          textAlignVertical: "top",
                          minHeight: 20,
                          maxHeight: 120, // limit so it doesn't grow too big
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={sendMessage}
                      className={`size-10 rounded-full items-center justify-center ${
                        newMessage.trim() ? "bg-green-500" : "bg-gray-300"
                      }`}
                      disabled={!newMessage.trim()}
                    >
                      <Feather name="send" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MessagesScreen;
