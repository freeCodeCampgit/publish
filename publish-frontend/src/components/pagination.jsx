import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

const Pagination = ({ pagInfo, endpoint }) => {
  const router = useRouter();
  const {
    pagination: { page, pageCount }
  } = pagInfo;

  return (
    <>
      <Button
        size='sm'
        isDisabled={page === 1}
        onClick={() => router.replace(`/${endpoint}?page=${page - 1}`)}
      >
        {'<'}
      </Button>
      <Box
        fontSize='sm'
        fontWeight='600'
        display='flex'
        alignItems='center'
        mx='2'
      >
        <Text>
          {page} of {pageCount}
        </Text>
      </Box>
      <Button
        size='sm'
        isDisabled={page === pageCount}
        onClick={() => router.replace(`/${endpoint}?page=${page + 1}`)}
      >
        {'>'}
      </Button>
    </>
  );
};

export default Pagination;
