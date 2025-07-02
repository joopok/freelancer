#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testFilters() {
  console.log('🧪 Testing Freelancer Filter Functionality...\n');

  try {
    // Test 1: Experience filter
    console.log('Test 1: Experience filter (3년 이하)');
    const response1 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=5&experience=3`);
    console.log(`✅ Experience filter: ${response1.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total with experience ≤ 3 years: ${response1.data.data?.totalCount || 0}`);
    
    // Test 2: Type filter
    console.log('\nTest 2: Type filter (개인)');
    const response2 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=5&type=개인`);
    console.log(`✅ Type filter: ${response2.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total individuals: ${response2.data.data?.totalCount || 0}`);
    
    // Test 3: Category filter
    console.log('\nTest 3: Category filter (개발자)');
    const response3 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=5&category=개발자`);
    console.log(`✅ Category filter: ${response3.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total developers: ${response3.data.data?.totalCount || 0}`);
    
    // Test 4: Sort by rating
    console.log('\nTest 4: Sort by rating (높은순)');
    const response4 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=3&sortBy=rating&sortOrder=desc`);
    console.log(`✅ Sort by rating: ${response4.data.data?.freelancers?.length || 0} items returned`);
    if (response4.data.data?.freelancers?.length > 1) {
      const ratings = response4.data.data.freelancers.map(f => f.rating);
      console.log(`   Ratings: ${ratings.join(', ')} (should be descending)`);
    }
    
    // Test 5: Sort by experience
    console.log('\nTest 5: Sort by experience (높은순)');
    const response5 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=3&sortBy=experience&sortOrder=desc`);
    console.log(`✅ Sort by experience: ${response5.data.data?.freelancers?.length || 0} items returned`);
    if (response5.data.data?.freelancers?.length > 1) {
      const experiences = response5.data.data.freelancers.map(f => f.experience);
      console.log(`   Experiences: ${experiences.join(', ')}`);
    }
    
    // Test 6: Combined filters
    console.log('\nTest 6: Combined filters (개인 + 경력 ≤ 6년 + 평점순)');
    const response6 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=3&type=개인&experience=6&sortBy=rating&sortOrder=desc`);
    console.log(`✅ Combined filters: ${response6.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total matching combined criteria: ${response6.data.data?.totalCount || 0}`);
    
    // Test 7: Skills filter
    console.log('\nTest 7: Skills filter (React)');
    const response7 = await axios.get(`${BASE_URL}/freelancers?page=1&pageSize=3&skills=React`);
    console.log(`✅ Skills filter: ${response7.data.data?.freelancers?.length || 0} items returned`);
    console.log(`   Total with React skills: ${response7.data.data?.totalCount || 0}`);
    
    console.log('\n🎉 Filter tests completed!');
    
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
testFilters();