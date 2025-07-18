const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Worker = require('../models/Worker');

const sampleWorkers = [
  {
    name: 'Raj Kumar',
    email: 'raj.plumber@demo.com',
    password: 'demo123',
    phone: '+91-9876543210',
    services: ['plumber'],
    experience: 8,
    hourlyRate: 350,
    address: {
      street: 'MG Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      coordinates: {
        latitude: 28.6139,
        longitude: 77.2090
      }
    },
    description: 'Experienced plumber specializing in pipe repairs, bathroom fittings, and emergency leak fixes.',
    rating: {
      average: 4.7,
      count: 23
    },
    isVerified: true,
    completedJobs: 45,
    totalEarnings: 15750,
    availability: {
      monday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      thursday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      friday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      saturday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      sunday: { available: false, timeSlots: [] }
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya.electrician@demo.com',
    password: 'demo123',
    phone: '+91-9876543211',
    services: ['electrician'],
    experience: 6,
    hourlyRate: 400,
    address: {
      street: 'Sector 15',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
      coordinates: {
        latitude: 28.4595,
        longitude: 77.0266
      }
    },
    description: 'Certified electrician with expertise in home wiring, appliance installation, and electrical repairs.',
    rating: {
      average: 4.9,
      count: 31
    },
    isVerified: true,
    completedJobs: 52,
    totalEarnings: 20800,
    availability: {
      monday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      thursday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      friday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      saturday: { available: true, timeSlots: [{ start: "10:00", end: "16:00" }] },
      sunday: { available: false, timeSlots: [] }
    }
  },
  {
    name: 'Sunita Devi',
    email: 'sunita.maid@demo.com',
    password: 'demo123',
    phone: '+91-9876543212',
    services: ['maid', 'cleaner'],
    experience: 12,
    hourlyRate: 200,
    address: {
      street: 'Malviya Nagar',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110017',
      coordinates: {
        latitude: 28.5355,
        longitude: 77.2074
      }
    },
    description: 'Reliable and trustworthy house cleaning expert with 12+ years of experience.',
    rating: {
      average: 4.8,
      count: 67
    },
    isVerified: true,
    completedJobs: 134,
    totalEarnings: 26800,
    availability: {
      monday: { available: true, timeSlots: [{ start: "07:00", end: "15:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "07:00", end: "15:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "07:00", end: "15:00" }] },
      thursday: { available: true, timeSlots: [{ start: "07:00", end: "15:00" }] },
      friday: { available: true, timeSlots: [{ start: "07:00", end: "15:00" }] },
      saturday: { available: true, timeSlots: [{ start: "08:00", end: "14:00" }] },
      sunday: { available: false, timeSlots: [] }
    }
  },
  {
    name: 'Ravi Verma',
    email: 'ravi.gardener@demo.com',
    password: 'demo123',
    phone: '+91-9876543213',
    services: ['gardener'],
    experience: 5,
    hourlyRate: 250,
    address: {
      street: 'Green Park',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      coordinates: {
        latitude: 28.5355,
        longitude: 77.3910
      }
    },
    description: 'Passionate gardener specializing in lawn maintenance, plant care, and landscape design.',
    rating: {
      average: 4.5,
      count: 18
    },
    isVerified: true,
    completedJobs: 29,
    totalEarnings: 7250,
    availability: {
      monday: { available: true, timeSlots: [{ start: "06:00", end: "16:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "06:00", end: "16:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "06:00", end: "16:00" }] },
      thursday: { available: true, timeSlots: [{ start: "06:00", end: "16:00" }] },
      friday: { available: true, timeSlots: [{ start: "06:00", end: "16:00" }] },
      saturday: { available: true, timeSlots: [{ start: "06:00", end: "16:00" }] },
      sunday: { available: true, timeSlots: [{ start: "07:00", end: "15:00" }] }
    }
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.carpenter@demo.com',
    password: 'demo123',
    phone: '+91-9876543214',
    services: ['carpenter', 'painter'],
    experience: 10,
    hourlyRate: 450,
    address: {
      street: 'Lajpat Nagar',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110024',
      coordinates: {
        latitude: 28.5677,
        longitude: 77.2431
      }
    },
    description: 'Expert carpenter and painter with 10+ years experience in furniture making and interior painting.',
    rating: {
      average: 4.6,
      count: 42
    },
    isVerified: true,
    completedJobs: 67,
    totalEarnings: 30150,
    availability: {
      monday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      thursday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      friday: { available: true, timeSlots: [{ start: "08:00", end: "18:00" }] },
      saturday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      sunday: { available: false, timeSlots: [] }
    }
  },
  {
    name: 'Meera Joshi',
    email: 'meera.cook@demo.com',
    password: 'demo123',
    phone: '+91-9876543215',
    services: ['cook'],
    experience: 15,
    hourlyRate: 300,
    address: {
      street: 'Rajouri Garden',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110027',
      coordinates: {
        latitude: 28.6508,
        longitude: 77.1240
      }
    },
    description: 'Professional cook specializing in North Indian cuisine with 15+ years of experience.',
    rating: {
      average: 4.9,
      count: 56
    },
    isVerified: true,
    completedJobs: 89,
    totalEarnings: 26700,
    availability: {
      monday: { available: true, timeSlots: [{ start: "07:00", end: "14:00" }, { start: "17:00", end: "21:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "07:00", end: "14:00" }, { start: "17:00", end: "21:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "07:00", end: "14:00" }, { start: "17:00", end: "21:00" }] },
      thursday: { available: true, timeSlots: [{ start: "07:00", end: "14:00" }, { start: "17:00", end: "21:00" }] },
      friday: { available: true, timeSlots: [{ start: "07:00", end: "14:00" }, { start: "17:00", end: "21:00" }] },
      saturday: { available: true, timeSlots: [{ start: "08:00", end: "20:00" }] },
      sunday: { available: true, timeSlots: [{ start: "08:00", end: "20:00" }] }
    }
  },
  {
    name: 'Suresh Kumar',
    email: 'suresh.driver@demo.com',
    password: 'demo123',
    phone: '+91-9876543216',
    services: ['driver'],
    experience: 7,
    hourlyRate: 200,
    address: {
      street: 'Karol Bagh',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110005',
      coordinates: {
        latitude: 28.6519,
        longitude: 77.1909
      }
    },
    description: 'Experienced driver with clean driving record and knowledge of Delhi NCR routes.',
    rating: {
      average: 4.4,
      count: 34
    },
    isVerified: true,
    completedJobs: 78,
    totalEarnings: 15600,
    availability: {
      monday: { available: true, timeSlots: [{ start: "06:00", end: "22:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "06:00", end: "22:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "06:00", end: "22:00" }] },
      thursday: { available: true, timeSlots: [{ start: "06:00", end: "22:00" }] },
      friday: { available: true, timeSlots: [{ start: "06:00", end: "22:00" }] },
      saturday: { available: true, timeSlots: [{ start: "07:00", end: "23:00" }] },
      sunday: { available: true, timeSlots: [{ start: "08:00", end: "20:00" }] }
    }
  },
  {
    name: 'Anil Mehta',
    email: 'anil.mechanic@demo.com',
    password: 'demo123',
    phone: '+91-9876543217',
    services: ['mechanic'],
    experience: 9,
    hourlyRate: 500,
    address: {
      street: 'Vasant Kunj',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110070',
      coordinates: {
        latitude: 28.5200,
        longitude: 77.1600
      }
    },
    description: 'Auto mechanic with expertise in car and bike repairs, maintenance, and diagnostics.',
    rating: {
      average: 4.7,
      count: 28
    },
    isVerified: true,
    completedJobs: 41,
    totalEarnings: 20500,
    availability: {
      monday: { available: true, timeSlots: [{ start: "09:00", end: "19:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "09:00", end: "19:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "09:00", end: "19:00" }] },
      thursday: { available: true, timeSlots: [{ start: "09:00", end: "19:00" }] },
      friday: { available: true, timeSlots: [{ start: "09:00", end: "19:00" }] },
      saturday: { available: true, timeSlots: [{ start: "09:00", end: "19:00" }] },
      sunday: { available: false, timeSlots: [] }
    }
  }
];

const seedWorkers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dailywageconnect');
    console.log('Connected to MongoDB');

    // Clear existing workers (optional)
    await Worker.deleteMany({});
    console.log('Cleared existing workers');

    // Hash passwords and create workers
    for (let workerData of sampleWorkers) {
      const salt = await bcrypt.genSalt(10);
      workerData.password = await bcrypt.hash(workerData.password, salt);
      
      const worker = new Worker(workerData);
      await worker.save();
      console.log(`Created worker: ${worker.name}`);
    }

    console.log('\n✅ Successfully seeded workers database!');
    console.log(`📊 Total workers created: ${sampleWorkers.length}`);
    console.log('\n🎯 You can now:');
    console.log('1. Search for workers on http://localhost:3000/search');
    console.log('2. Filter by service type, location, rating, etc.');
    console.log('3. View worker profiles and book services');
    console.log('\n📱 Demo worker accounts:');
    sampleWorkers.forEach(worker => {
      console.log(`   ${worker.name} (${worker.services.join(', ')}) - ${worker.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding workers:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedWorkers();
}

module.exports = { seedWorkers, sampleWorkers };