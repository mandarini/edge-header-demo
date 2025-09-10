# Supabase `x-client-info` Header Demo

This repository demonstrates how the `x-client-info` header is automatically sent by Supabase client libraries and how to access it in Edge Functions.

## 🎯 Purpose

This demo shows that:

1. **Supabase JS client automatically sends the `x-client-info` header** with every request
2. **Edge Functions can access and read this header** for client identification
3. The header contains valuable information about the client library and version

## 📁 Project Structure

```tree
.
├── supabase/
│   └── functions/
│       └── echo-client-info/
│           └── index.ts        # Edge Function that reads x-client-info header
├── test-client-info.mjs        # Test script to verify header behavior
├── package.json                 # Node.js dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Node.js 18+ installed
- Docker Desktop running (required for local Supabase)

### Installation

1. Clone this repository:
```bash
git clone git@github.com:mandarini/edge-header-demo.git
cd edge-header-demo
```

2. Install dependencies:
```bash
npm i
```

3. Start Supabase local development:
```bash
supabase start
```

4. In a separate terminal, serve the Edge Function:
```bash
supabase functions serve echo-client-info --no-verify-jwt
```

5. Run the test:
```bash
node test-client-info.mjs
```

## 📋 What This Demo Shows

### The Edge Function (`supabase/functions/echo-client-info/index.ts`)

This Edge Function:
- Reads the `x-client-info` header from incoming requests
- Returns all headers for debugging purposes
- Shows multiple ways to access the header (different casings)

### The Test Script (`test-client-info.mjs`)

Performs two tests:

1. **Test 1: Using `supabase.functions.invoke()`**
   - Shows that supabase-js automatically includes `x-client-info` header
   - Value format: `supabase-js-node/2.57.4`

2. **Test 2: Direct fetch with manual header**
   - Confirms Edge Functions can receive custom `x-client-info` values
   - Demonstrates the header is properly processed

## 📊 Expected Output

When you run the test, you should see:

```
🧪 Test 1: Using supabase.functions.invoke()
----------------------------------------
✅ Response received!
🎯 x-client-info FOUND: supabase-js-node/2.57.4

🧪 Test 2: Direct fetch with explicit X-Client-Info header
----------------------------------------
✅ Response received!
🎯 x-client-info FOUND: test-client/1.0.0
```

## 🔍 Key Findings

1. **The header IS automatically sent** by all Supabase client libraries
2. **Header format**: `<library-name>/<version>` (e.g., `supabase-js-node/2.57.4`)
3. **Case-insensitive**: The header can be accessed as `x-client-info`, `X-Client-Info`, etc.

## 🐛 Troubleshooting

### Port Already in Use Error

If you see "port is already allocated" error:

```bash
supabase stop --project-id <other-project-id>
```

### Edge Function Not Found (503 Error)

Make sure the Edge Function is running:

```bash
supabase functions serve echo-client-info --no-verify-jwt
```