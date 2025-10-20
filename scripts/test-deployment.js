#!/usr/bin/env node

/**
 * Deployment Test Script
 * 
 * This script helps test your Vercel deployment for common issues
 * that can cause 500 errors after several hours of operation.
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://rsight.vercel.app';

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testDeployment() {
  console.log('🔍 Testing deployment health...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/api/health`,
      expectedStatus: 200
    },
    {
      name: 'Home Page',
      url: BASE_URL,
      expectedStatus: 200
    },
    {
      name: 'Dashboard (should redirect to login if not authenticated)',
      url: `${BASE_URL}/dashboard`,
      expectedStatus: [200, 307, 401] // Multiple acceptable statuses
    }
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await makeRequest(test.url);
      
      const expectedStatuses = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus 
        : [test.expectedStatus];
      
      if (expectedStatuses.includes(response.status)) {
        console.log(`✅ ${test.name}: ${response.status} OK`);
      } else {
        console.log(`❌ ${test.name}: Expected ${expectedStatuses.join(' or ')}, got ${response.status}`);
        if (response.data) {
          console.log(`   Response: ${response.data.substring(0, 200)}...`);
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🏁 Deployment test completed!');
  console.log('\nIf you see any ❌ errors, those endpoints may need attention.');
  console.log('The health check endpoint should help diagnose database connection issues.');
}

if (require.main === module) {
  testDeployment().catch(console.error);
}

module.exports = { testDeployment };
