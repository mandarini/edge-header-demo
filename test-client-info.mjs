#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Local Supabase instance (default local dev values)
const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = 'YOUR ANON KEY'

console.log('Testing x-client-info header locally...\n')
console.log('Make sure you have started the edge function with:')
console.log('supabase functions serve echo-client-info --no-verify-jwt\n')
console.log('='.repeat(60) + '\n')

async function testClientInfo() {
  // Test 1: Using Supabase client with functions.invoke
  console.log('🧪 Test 1: Using supabase.functions.invoke()')
  console.log('-'.repeat(40))
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  try {
    const { data, error } = await supabase.functions.invoke('echo-client-info', {
      body: { test: 'from supabase client' }
    })
    
    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Response received!\n')
      
      // Check for x-client-info
      if (data?.xclientinfo) {
        console.log('🎯 x-client-info FOUND:', data.xclientinfo)
      } else {
        console.log('⚠️  x-client-info NOT FOUND')
      }
      
      // Show alternatives
      console.log('\n📋 Alternative header names checked:')
      Object.entries(data?.alternatives || {}).forEach(([key, value]) => {
        console.log(`  ${key}: ${value || 'null'}`)
      })
      
      // Show all headers
      console.log('\n📦 All headers received by edge function:')
      Object.entries(data?.allHeaders || {}).forEach(([key, value]) => {
        if (key.toLowerCase().includes('client') || key.toLowerCase().includes('user-agent')) {
          console.log(`  ➡️  ${key}: ${value}`)
        } else {
          console.log(`      ${key}: ${value}`)
        }
      })
    }
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }

  console.log('\n' + '='.repeat(60) + '\n')

  // Test 2: Direct fetch with explicit header
  console.log('🧪 Test 2: Direct fetch with explicit X-Client-Info header')
  console.log('-'.repeat(40))
  
  try {
    const response = await fetch('http://127.0.0.1:54321/functions/v1/echo-client-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-Client-Info': 'test-client/1.0.0'  // Explicitly set
      },
      body: JSON.stringify({ test: 'direct fetch' })
    })
    
    const data = await response.json()
    console.log('✅ Response received!\n')
    
    if (data?.xclientinfo) {
      console.log('🎯 x-client-info FOUND:', data.xclientinfo)
    } else {
      console.log('⚠️  x-client-info NOT FOUND (but we explicitly set it!)')
    }
    
    console.log('\n📦 Headers when explicitly set:')
    Object.entries(data?.allHeaders || {}).forEach(([key, value]) => {
      if (key.toLowerCase().includes('client')) {
        console.log(`  ➡️  ${key}: ${value}`)
      }
    })
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }
}

testClientInfo().then(() => {
  console.log('\n' + '='.repeat(60))
  console.log('✅ Test completed!')
  console.log('\n💡 What to look for:')
  console.log('   - Test 1 should show if supabase-js is sending X-Client-Info')
  console.log('   - Test 2 confirms the edge function can receive the header')
  console.log('   - Check if the header appears under a different name')
  process.exit(0)
}).catch(err => {
  console.error('❌ Test error:', err)
  process.exit(1)
})
