import React, { createContext, useContext, useState, useRef } from 'react';
import { useToast } from "@chakra-ui/react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notifiedMessages, setNotifiedMessages] = useState(new Set()); // Track notified messages
  const toast = useToast();
  const notificationCooldownRef = useRef(false);

  const addNotification = (notification) => {
    // Check if the message has already been notified or if cooldown is active
    if (notificationCooldownRef.current || notifiedMessages.has(notification.content)) {
      return;
    }

    // Update notifications state
    setNotifications((prevNotifications) => [...prevNotifications, notification]);

    // Play sound
    const sound = new Audio("/img/iphone_notification.mp3");
    sound.play();
    
    // Show toast notification
    toast({
      title: "New message",
      description: notification.content,
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top-right",
      variant: "solid",
      containerStyle: {
        backgroundColor: "#2b6cb0",
        color: "white",
      },
    });

    // Mark the message as notified
    setNotifiedMessages((prev) => new Set(prev).add(notification.content));

    // Set cooldown period to avoid continuous notifications
    notificationCooldownRef.current = true;
    setTimeout(() => {
      notificationCooldownRef.current = false;
    }, 2000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);