import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Spinner, 
  Text, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Alert, 
  AlertIcon, 
  Container, 
  VStack, 
  Heading, 
  HStack, 
  Button, 
  IconButton, 
  Select 
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const TransactionDetails = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [hostData, setHostData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filteredHost, setFilteredHost] = useState('');
  const [filteredPackage, setFilteredPackage] = useState('');

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      // Fetch host data
      fetch('https://esmpbe.id.vn/api/host', {
        method: 'GET',
        headers: {
          'Authorization': `${accessToken}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to fetch host information.');
        }
        return response.json();
      })
      .then(hostList => {
        if (hostList && hostList.length > 0) {
          setHostData(hostList);
          return fetch('https://esmpbe.id.vn/api/transactionpackage', {
            method: 'GET',
            headers: {
              'Authorization': `${accessToken}`,
            },
          });
        } else {
          throw new Error('No hosts found.');
        }
      })
      .then(response => response.json())
      .then(transactions => {
        setTransactionData(transactions);
        return fetch('https://esmpbe.id.vn/api/package', {
          method: 'GET',
          headers: {
            'Authorization': `${accessToken}`,
          },
        });
      })
      .then(response => response.json())
      .then(packages => {
        setPackages(packages);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
    } else {
      setError('No access token found.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading data...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent>
        <Alert status="error" borderRadius="md" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  // Compile data for the table
  const compiledData = transactionData
    .map(transaction => {
      const hostInfo = hostData.find(host => host.hostid === transaction.hostid);
      const packageInfo = packages.find(pkg => pkg.id === transaction.packageid);
      const createdAtDate = new Date(transaction.createdat);

      const storageMonths = packageInfo ? parseInt(packageInfo.eventstoragetime) : 0;

      const expirationDate = new Date(createdAtDate);
      expirationDate.setMonth(expirationDate.getMonth() + storageMonths);

      return {
        transactionId: transaction.id,
        hostName: hostInfo ? hostInfo.account.name : 'Unknown',
        packageName: packageInfo ? packageInfo.name : 'Unknown',
        createdAt: createdAtDate.toLocaleString(),
        status: transaction.status,
        price: packageInfo ? packageInfo.price : 'N/A',
        expiration: expirationDate.toLocaleString(),
      };
    })
    .filter(transaction => {
      // Filter based on selected filters
      const hostMatch = filteredHost ? transaction.hostName.includes(filteredHost) : true;
      const packageMatch = filteredPackage ? transaction.packageName.includes(filteredPackage) : true;
      return hostMatch && packageMatch;
    });

  // Calculate total pages
  const totalPages = Math.ceil(compiledData.length / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = compiledData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container maxW="100%" backgroundColor="white" borderRadius="md" boxShadow="lg"  p={5}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="lg">Transaction List</Heading>
        <Text fontSize="lg" color="gray.600">Overview of all transactions</Text>

        {/* Filter Section */}
        <HStack spacing={4} width="100%" mb={4}>
          <Select
            placeholder="Select Host"
            value={filteredHost}
            onChange={(e) => setFilteredHost(e.target.value)}
            width="auto"
          >
            <option value="">All Hosts</option>
            {hostData && hostData.map(host => (
              <option key={host.hostid} value={host.account.name}>
                {host.account.name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select Package"
            value={filteredPackage}
            onChange={(e) => setFilteredPackage(e.target.value)}
            width="auto"
          >
            <option value="">All Packages</option>
            {packages && packages.map(pkg => (
              <option key={pkg.id} value={pkg.name}>
                {pkg.name}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Table Section */}
        <Box overflowX="auto" width="100%">
          <Table variant="striped" width="100%">
            <Thead>
              <Tr>
                <Th>Transaction ID</Th>
                <Th>Host Name</Th>
                <Th>Package Name</Th>
                <Th>Creation Date</Th>
                <Th>Status</Th>
                <Th>Price</Th>
                <Th>Expiration Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map(transaction => (
                <Tr key={transaction.transactionId}>
                  <Td>{transaction.transactionId}</Td>
                  <Td>{transaction.hostName}</Td>
                  <Td>{transaction.packageName}</Td>
                  <Td>
                    <Text fontWeight="bold" color="blue.500">
                      {transaction.createdAt}
                    </Text>
                  </Td>
                  <Td>{transaction.status}</Td>
                  <Td>{transaction.price}</Td>
                  <Td>
                    <Text fontWeight="bold" color="red.500">
                      {transaction.expiration}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination Controls */}
        <HStack spacing={4} mt={4} justify="center">
          <IconButton 
            aria-label="Previous page"
            icon={<ChevronLeftIcon />}
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            colorScheme="teal"
            variant="outline"
          />
          <Text fontWeight="bold">Page {currentPage} of {totalPages}</Text>
          <IconButton 
            aria-label="Next page"
            icon={<ChevronRightIcon />}
            isDisabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            colorScheme="teal"
            variant="outline"
          />
        </HStack>
      </VStack>
    </Container>
  );
};

export default TransactionDetails;
