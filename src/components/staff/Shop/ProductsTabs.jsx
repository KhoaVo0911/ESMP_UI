import React from "react";
import { SimpleGrid, Box, Button } from "@chakra-ui/react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Royale De Luxe",
    weight: "140 g",
    price: 2.5,
    image: "burger.jpg",
    highlighted: true,
  },
  {
    id: 2,
    name: "Royale De Luxe",
    weight: "140 g",
    price: 2.5,
    image: "burger.jpg",
  },
  // Add more products...
];

const Shop = () => {
  return (
    <Box p={5}>
      <SimpleGrid columns={[2, null, 4]} spacing="40px">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
      <Button mt={5} colorScheme="teal" variant="outline">
        Show More
      </Button>
    </Box>
  );
};

export default Shop;
