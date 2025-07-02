#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testPagination() {
  console.log('🧪 Testing Freelancer API Pagination...\n');

  try {
    // Test 1: First page with 5 items
    console.log('Test 1: First page with 5 items per page');
    const response1 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=5`);
    console.log(`✅ Page 1: ${response1.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total: ${response1.data.data?.totalCount || 0}, Total Pages: ${response1.data.data?.totalPages || 0}`);
    
    if (response1.data.data?.freelancers?.length > 5) {
      console.log('❌ ERROR: More than 5 items returned!');
    }
    
    // Test 2: Second page with 5 items
    console.log('\nTest 2: Second page with 5 items per page');
    const response2 = await axios.get(`${BASE_URL}/freelancers?page=2&pageSize=5`);
    console.log(`✅ Page 2: ${response2.data.data?.freelancers?.length || 0} items returned`);
    
    // Test 3: Default pagination (10 items)
    console.log('\nTest 3: Default pagination (10 items per page)');
    const response3 = await axios.get(`${BASE_URL}/freelancers?page=1`);
    console.log(`✅ Default: ${response3.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total: ${response3.data.data?.totalCount || 0}, Total Pages: ${response3.data.data?.totalPages || 0}`);
    
    if (response3.data.data?.freelancers?.length > 10) {
      console.log('❌ ERROR: More than 10 items returned on default pagination!');
    }
    
    // Test 4: Large page number (should return empty or small result)
    console.log('\nTest 4: Large page number');
    const response4 = await axios.get(`${BASE_URL}/freelancers?page=100&pageSize=10`);
    console.log(`✅ Page 100: ${response4.data.data?.freelancers?.length || 0} items returned`);
    
    // Test 5: Search with pagination
    console.log('\nTest 5: Search with pagination');
    const response5 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=3&search=developer`);
    console.log(`✅ Search 'developer': ${response5.data.data?.freelancers?.length || 0} items returned`);
    
    console.log('\n🎉 Pagination tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Please make sure the development server is running: npm run dev');
    }
  }
}

// Run tests
testPagination();