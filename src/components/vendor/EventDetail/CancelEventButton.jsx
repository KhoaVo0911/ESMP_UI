import React, { useState } from 'react';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CancelEventButton = ({ onCancel, vendorinEventId, eventId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const accessToken = sessionStorage.getItem('accessToken'); // Get the access token from sessionStorage
  const vendorId = sessionStorage.getItem('vendorId');
  const navigate = useNavigate(); // Initialize navigate from react-router-dom
  console.log("hehe", vendorinEventId)

  const [locationId, setLocationId] = useState(null);
  const [typeId, setTypeId] = useState(null);

  const handleCancelConfirmation = async () => {
    try {
      // Step 1: Get event payment details (locationId and typeId)
      const eventPaymentResponse = await axios.get(`/eventpayment/vendorinEventId/${vendorinEventId}`, {
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const { locationId, typeId } = eventPaymentResponse.data;

      setLocationId(locationId); // Save locationId and typeId for the map update
      setTypeId(typeId);

      // Step 2: Update status to "cancel" in the vendor in event table
      await axios.put(
        `/vendorinevent/${vendorinEventId}`,
        {
          vendorinEventId: vendorinEventId,
          eventId: eventId,
          vendorId: vendorId,
          status: 'cancel',
        },
        {
          headers: {
            Authorization: `${accessToken}`, // Include access token in the request
            'Content-Type': 'application/json',
          },
        }
      );

      // Step 3: Update payment status to "Refunding Deposit"
      await axios.put(
        `/eventpayment/${vendorinEventId}`,
        { status: 'Refunding Deposit' },
        {
          headers: {
            Authorization: `${accessToken}`, // Include access token in the request
            'Content-Type': 'application/json',
          },
        }
      );

      // Step 4: Update map status to "Available"
      if (locationId && typeId) {
        await axios.put(
          `/map`,
          {
            locationId: locationId,
            typeId: typeId,
            status: 'Available',
          },
          {
            headers: {
              Authorization: `${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Step 5: After cancellation, navigate back to the event page
      navigate(`/events/${vendorId}/${eventId}`, {
        state: { eventId, vendorId },
      });

      // Close the modal and execute onCancel callback if required
      onClose();
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error canceling event:', error);
    }
  };

  return (
    <>
      <Button colorScheme="red" size="lg" onClick={onOpen}>
        Cancel Event
      </Button>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Cancellation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to cancel your participation in this event?</Text>
            <Text mt={4} color="gray.500">
              Please note: Your payment will be refunded after the event ends.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCancelConfirmation}>
              Yes, Cancel Event
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No, Keep Participation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CancelEventButton;
