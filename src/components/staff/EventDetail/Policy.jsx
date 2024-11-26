import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";

const Policy = ({ onBack, onProceedToPayment }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const [isAccepted, setIsAccepted] = useState(false); // State để kiểm tra tick checkbox

  return (
    <Box
      flex="2" // Đảm bảo kích thước bằng BoothDetails
      bg={bgColor}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      ml={4}
      p={4}
      height="70vh" // Đảm bảo chiều cao phù hợp
      display="flex"
      flexDirection="column"
    >
      <Heading size="md" mb={4} textAlign="center">
        Booth Registration Policy
      </Heading>

      <Box
        overflowY="auto" // Kích hoạt cuộn nếu nội dung dài
        flex="1" // Nội dung chính chiếm phần không gian linh hoạt
        pr={2} // Padding phải để tránh nội dung bị che khi cuộn
      >
        <VStack align="start" spacing={3}>
          {/* Section 1 */}
          <Box>
            <Heading size="sm">1. Registration Process</Heading>
            <Text mt={2}>
              <strong>Online Registration:</strong> Vendors must provide complete
              information about the company/individual, products/services, contact details,
              and special requirements (if any).
            </Text>
            <Text mt={2}>
              <strong>Confirmation and Payment:</strong> After receiving the registration
              form, the host will confirm within [X] working days. Vendors must complete
              payment within the stipulated time after receiving the confirmation notice.
              Failure to do so will result in the booth being reallocated to another
              vendor.
            </Text>
          </Box>
 {/* Section 2 */}
 <Box>
            <Heading size="sm">2. Vendor Benefits</Heading>
            <Text mt={2}>
              <strong>Booth Usage Rights:</strong> Vendors are granted the right to use the
              registered booth throughout the event duration.
            </Text>
            <Text>
              Each booth will have basic amenities such as electricity and water (if
              applicable). Vendors can request additional amenities at an extra cost.
            </Text>
            <Text mt={2}>
              <strong>Promotion Rights:</strong> Vendors have the right to promote their
              products/services at the booth and utilize official event marketing channels
              (if previously agreed upon).
            </Text>
            <Text>
              Vendors can use event images and information for self-promotion within the
              limits set by the host.
            </Text>
          </Box>

          {/* Section 3 */}
          <Box>
            <Heading size="sm">3. Vendor Obligations</Heading>
            <Text mt={2}>
              <strong>Compliance with Event Regulations:</strong> Vendors must comply with
              all safety, hygiene, and legal regulations during the event.
            </Text>
            <Text>
              Products/services must not violate any laws, including prohibited or
              copyrighted items.
            </Text>
            <Text mt={2}>
              <strong>Property Protection:</strong> Vendors are responsible for protecting
              shared assets and equipment at the booth. Any damages caused by the vendor
              will require compensation for repair or replacement.
            </Text>
            <Text mt={2}>
              <strong>Time and Arrangement:</strong> Vendors must be present and complete
              booth setup according to the event's timeline. All booth arrangements and
              decorations must meet the host's requirements and standards.
            </Text>
          </Box>

          {/* Section 4 */}
          <Box>
            <Heading size="sm">4. Registration Cancellation</Heading>
            <Text mt={2}>
              <strong>Cancellation Policy:</strong> Vendors can cancel their booth
              registration up to [X] days before the event without incurring any fees. If
              canceled after this period, vendors will incur a cancellation fee of [X%] of
              the total registration cost.
            </Text>
          </Box>

          {/* Section 5 */}
          <Box>
            <Heading size="sm">5. Legal Responsibilities</Heading>
            <Text mt={2}>
              <strong>Responsibility for Products:</strong> Vendors are fully responsible
              for the quality, origin, and legality of the products/services showcased at
              the event.
            </Text>
            <Text>
              Vendors must ensure good service and promptly address any customer requests
              or complaints.
            </Text>
          </Box>

          {/* Section 6 */}
          <Box>
            <Heading size="sm">6. Refund Policy</Heading>
            <Text mt={2}>
              In case the event is canceled due to factors beyond control (natural
              disasters, pandemics, etc.), vendors will receive a refund as per mutual
              agreement.
            </Text>
          </Box>
          {/* Các phần khác tương tự như mã trước */}
          {/* Section 7 */}
          <Box>
            <Heading size="sm">7. Additional Terms</Heading>
            <Text mt={2}>
              <strong>Changes to Conditions:</strong> Any changes to booths, products, or
              services must be notified and approved by the host before the event.
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Checkbox và Nút */}
      <Box mt={4}>
        <Checkbox
          isChecked={isAccepted}
          onChange={(e) => setIsAccepted(e.target.checked)}
        >
          I have read and agree to the terms and conditions of the policy.
        </Checkbox>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button colorScheme="gray" onClick={onBack}>
            Back to Booth Details
          </Button>
          <Button
            colorScheme="blue"
            onClick={onProceedToPayment}
            isDisabled={!isAccepted} // Chỉ kích hoạt nút khi đã tick checkbox
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Policy;
