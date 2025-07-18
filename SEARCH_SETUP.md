# 🔍 DailyWageConnect Search Workers Setup

## Quick Setup for Search Functionality

### Step 1: Start the Application
```bash
# Make sure MongoDB is running
sudo systemctl start mongod

# Start both frontend and backend
npm run dev
```

### Step 2: Seed Sample Workers (IMPORTANT!)
The search functionality needs workers in the database to display results.

```bash
# Add sample workers to the database
npm run seed
```

This will create 8 sample workers with different services:
- **Raj Kumar** - Plumber (Delhi) - ₹350/hr
- **Priya Sharma** - Electrician (Gurgaon) - ₹400/hr  
- **Sunita Devi** - Maid/Cleaner (Delhi) - ₹200/hr
- **Ravi Verma** - Gardener (Noida) - ₹250/hr
- **Vikram Singh** - Carpenter/Painter (Delhi) - ₹450/hr
- **Meera Joshi** - Cook (Delhi) - ₹300/hr
- **Suresh Kumar** - Driver (Delhi) - ₹200/hr
- **Anil Mehta** - Mechanic (Delhi) - ₹500/hr

### Step 3: Test Search Functionality

1. **Go to Search Page**: 
   - Navigate to http://localhost:3000/search
   - Or click "Find Workers" from the homepage

2. **Test Filters**:
   - **Service Filter**: Select "Plumber", "Electrician", etc.
   - **Location Filter**: Type "Delhi", "Gurgaon", "Noida"
   - **Rating Filter**: Choose "4+ Stars", "4.5+ Stars"
   - **Price Filter**: Set max hourly rate (e.g., 300)
   - **Sort Options**: Rating, Experience, Price

3. **Test Search Bar**:
   - Search by name: "Raj", "Priya"
   - Search by service: "plumber", "cook"
   - Search by location: "Delhi", "Gurgaon"

### Available Features

✅ **Advanced Filtering**
- Filter by service type (10 different services)
- Filter by city/location
- Filter by minimum rating
- Filter by maximum hourly rate
- Multiple sort options

✅ **Search Functionality**
- Search by worker name
- Search by service type
- Search by location
- Search in descriptions

✅ **Worker Cards Display**
- Beautiful worker profile cards
- Service badges with icons
- Rating display with star count
- Experience and hourly rate
- Location information
- Verification status
- "Available Now" indicator

✅ **Interactive Features**
- Save workers to favorites (for logged-in users)
- View worker profiles
- Book services directly
- Responsive design for mobile

✅ **Real-time Data**
- Live availability status
- Current time-based availability
- Pagination for large results
- Loading states and error handling

### Testing Different Scenarios

**Test 1: Filter by Service**
- Select "Plumber" → Should show Raj Kumar
- Select "Cook" → Should show Meera Joshi

**Test 2: Filter by Location**
- Type "Delhi" → Should show 6 workers
- Type "Gurgaon" → Should show Priya Sharma

**Test 3: Filter by Price**
- Set max rate to 250 → Should show 3 workers (Sunita, Ravi, Suresh)
- Set max rate to 500 → Should show all workers

**Test 4: Search by Name**
- Search "Raj" → Should show Raj Kumar
- Search "cook" → Should show Meera Joshi

**Test 5: Combined Filters**
- Service: "Electrician" + City: "Gurgaon" → Should show Priya Sharma
- Max Rate: 300 + Min Rating: 4.5 → Should show filtered results

### Troubleshooting

**No workers showing?**
```bash
# Make sure you ran the seeder
npm run seed

# Check if MongoDB is running
sudo systemctl status mongod
```

**Search not working?**
- Check browser console for API errors
- Verify backend is running on http://localhost:5000
- Test API directly: http://localhost:5000/api/workers

**Filters not applying?**
- Clear browser cache
- Check network tab in developer tools
- Ensure all query parameters are being sent

### API Endpoints Being Used

- `GET /api/workers` - Main search endpoint
- `GET /api/workers/:id` - Individual worker profile
- `POST /api/users/save-worker/:id` - Save to favorites

### Next Steps

1. **Test the search functionality** with the sample data
2. **Create user account** to test booking features
3. **Register as worker** to see worker dashboard
4. **Book a service** to test the full workflow

The search functionality is now **fully working** with beautiful UI, advanced filtering, and real-time data! 🎉