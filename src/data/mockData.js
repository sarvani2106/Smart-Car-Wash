// src/data/mockData.js
//
// Centralized mock data for the SmartWash frontend prototype.
// All three developer tracks (Customer / Provider / Admin) should import
// from this single file so every dashboard reflects the same connected data.
//
// Data is intentionally shaped close to what a real REST API would return,
// so swapping this file out for real API calls later is a low-effort change.
// IDs use simple, human-readable prefixes (USR-, VEH-, SVC-, PRV-, BKG-)
// and are cross-referenced consistently across all collections.

// ---------------------------------------------------------------------------
// 1. USERS
// Roles: "customer" | "provider" | "admin"
// ---------------------------------------------------------------------------
export const users = [
  // --- Customers ---
  {
    id: "USR-1001",
    role: "customer",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 98765 43210",
    avatar: "https://placehold.co/100x100?text=AR",
    address: "Flat 302, Lakeview Residency, Hyderabad",
    joinedOn: "2024-11-02",
  },
  {
    id: "USR-1002",
    role: "customer",
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    phone: "+91 98123 45670",
    avatar: "https://placehold.co/100x100?text=RS",
    address: "Plot 14, Green Park, Bengaluru",
    joinedOn: "2025-01-15",
  },
  {
    id: "USR-1003",
    role: "customer",
    name: "Meera Iyer",
    email: "meera.iyer@example.com",
    phone: "+91 99887 66554",
    avatar: "https://placehold.co/100x100?text=MI",
    address: "12-A, Palm Grove Apartments, Chennai",
    joinedOn: "2025-03-08",
  },

  // --- Service Providers ---
  {
    id: "USR-2001",
    role: "provider",
    name: "Suresh Kumar",
    email: "suresh.kumar@smartwash.com",
    phone: "+91 91234 56789",
    avatar: "https://placehold.co/100x100?text=SK",
    address: "Base Hub: Madhapur, Hyderabad",
    joinedOn: "2024-09-10",
  },
  {
    id: "USR-2002",
    role: "provider",
    name: "Priya Nair",
    email: "priya.nair@smartwash.com",
    phone: "+91 90909 12345",
    avatar: "https://placehold.co/100x100?text=PN",
    address: "Base Hub: Koramangala, Bengaluru",
    joinedOn: "2024-10-22",
  },
  {
    id: "USR-2003",
    role: "provider",
    name: "Karthik Reddy",
    email: "karthik.reddy@smartwash.com",
    phone: "+91 93456 78901",
    avatar: "https://placehold.co/100x100?text=KR",
    address: "Base Hub: T. Nagar, Chennai",
    joinedOn: "2025-02-01",
  },

  // --- Admin ---
  {
    id: "USR-3001",
    role: "admin",
    name: "Divya Menon",
    email: "divya.menon@smartwash.com",
    phone: "+91 90000 11122",
    avatar: "https://placehold.co/100x100?text=DM",
    address: "SmartWash HQ, Hyderabad",
    joinedOn: "2024-06-01",
  },
];

// ---------------------------------------------------------------------------
// 2. VEHICLES
// vehicleType: "Hatchback" | "Sedan" | "SUV" | "Luxury" | "Bike"
// ---------------------------------------------------------------------------
export const vehicles = [
  {
    id: "VEH-5001",
    customerId: "USR-1001",
    brand: "Hyundai",
    model: "Creta",
    registrationNumber: "TS09EA1234",
    vehicleType: "SUV",
  },
  {
    id: "VEH-5002",
    customerId: "USR-1001",
    brand: "Honda",
    model: "Activa",
    registrationNumber: "TS09FB5678",
    vehicleType: "Bike",
  },
  {
    id: "VEH-5003",
    customerId: "USR-1002",
    brand: "Maruti Suzuki",
    model: "Swift",
    registrationNumber: "KA05MK9087",
    vehicleType: "Hatchback",
  },
  {
    id: "VEH-5004",
    customerId: "USR-1003",
    brand: "BMW",
    model: "3 Series",
    registrationNumber: "TN07CX4455",
    vehicleType: "Luxury",
  },
  {
    id: "VEH-5005",
    customerId: "USR-1003",
    brand: "Toyota",
    model: "Innova Crysta",
    registrationNumber: "TN07DY7788",
    vehicleType: "SUV",
  },
];

// ---------------------------------------------------------------------------
// 3. SERVICES (service catalog, managed by Admin, consumed by Customer)
// type: "Exterior" | "Interior" | "Combo" | "Detailing" | "Coating" | "Add-on"
// duration is in minutes
// ---------------------------------------------------------------------------
export const services = [
  {
    id: "SVC-0001",
    name: "Exterior Car Wash",
    type: "Exterior",
    description:
      "A thorough hand wash of the vehicle's exterior including foam wash, rinse, and dry wipe.",
    duration: 30,
    price: 299,
    image: "https://placehold.co/400x250?text=Exterior+Wash",
    isActive: true,
  },
  {
    id: "SVC-0002",
    name: "Interior Cleaning",
    type: "Interior",
    description:
      "Vacuuming of seats and carpets, dashboard polishing, and window cleaning from the inside.",
    duration: 45,
    price: 399,
    image: "https://placehold.co/400x250?text=Interior+Cleaning",
    isActive: true,
  },
  {
    id: "SVC-0003",
    name: "Premium Car Wash",
    type: "Combo",
    description:
      "Combines exterior foam wash with basic interior vacuuming for a complete refresh.",
    duration: 60,
    price: 599,
    image: "https://placehold.co/400x250?text=Premium+Wash",
    isActive: true,
  },
  {
    id: "SVC-0004",
    name: "Full Car Detailing",
    type: "Detailing",
    description:
      "In-depth exterior polish, interior shampoo, engine bay cleaning, and tyre dressing.",
    duration: 150,
    price: 2499,
    image: "https://placehold.co/400x250?text=Full+Detailing",
    isActive: true,
  },
  {
    id: "SVC-0005",
    name: "Ceramic Coating",
    type: "Coating",
    description:
      "Long-lasting ceramic protective layer applied to the exterior for a glossy, water-repellent finish.",
    duration: 240,
    price: 6999,
    image: "https://placehold.co/400x250?text=Ceramic+Coating",
    isActive: true,
  },
  {
    id: "SVC-0006",
    name: "Wheel Cleaning",
    type: "Add-on",
    description:
      "Deep cleaning of alloy wheels, tyres, and wheel arches to remove brake dust and grime.",
    duration: 20,
    price: 199,
    image: "https://placehold.co/400x250?text=Wheel+Cleaning",
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// 4. PROVIDERS (extends the "provider" users with operational details)
// status: "active" | "inactive" | "on-leave"
// ---------------------------------------------------------------------------
export const providers = [
  {
    id: "PRV-7001",
    userId: "USR-2001",
    serviceTypes: ["Exterior", "Interior", "Combo", "Add-on"],
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      slots: ["09:00 AM - 11:00 AM", "11:30 AM - 01:30 PM", "03:00 PM - 05:00 PM"],
    },
    status: "active",
  },
  {
    id: "PRV-7002",
    userId: "USR-2002",
    serviceTypes: ["Detailing", "Coating", "Combo"],
    availability: {
      days: ["Mon", "Wed", "Fri", "Sat", "Sun"],
      slots: ["10:00 AM - 01:00 PM", "02:00 PM - 06:00 PM"],
    },
    status: "active",
  },
  {
    id: "PRV-7003",
    userId: "USR-2003",
    serviceTypes: ["Exterior", "Interior", "Add-on"],
    availability: {
      days: ["Tue", "Thu", "Sat", "Sun"],
      slots: ["08:00 AM - 10:00 AM", "04:00 PM - 06:00 PM"],
    },
    status: "on-leave",
  },
];

// ---------------------------------------------------------------------------
// 5. BOOKINGS (the connective tissue between all dashboards)
// status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
// ---------------------------------------------------------------------------
export const bookings = [
  {
    id: "BKG-9001",
    customerId: "USR-1001",
    providerId: "PRV-7001",
    vehicleId: "VEH-5001",
    serviceId: "SVC-0003",
    date: "2025-09-02",
    timeSlot: "11:30 AM - 01:30 PM",
    location: "Flat 302, Lakeview Residency, Hyderabad",
    price: 599,
    status: "confirmed",
  },
  {
    id: "BKG-9002",
    customerId: "USR-1001",
    providerId: "PRV-7001",
    vehicleId: "VEH-5002",
    serviceId: "SVC-0006",
    date: "2025-09-02",
    timeSlot: "03:00 PM - 05:00 PM",
    location: "Flat 302, Lakeview Residency, Hyderabad",
    price: 199,
    status: "pending",
  },
  {
    id: "BKG-9003",
    customerId: "USR-1002",
    providerId: "PRV-7002",
    vehicleId: "VEH-5003",
    serviceId: "SVC-0004",
    date: "2025-08-28",
    timeSlot: "02:00 PM - 06:00 PM",
    location: "Plot 14, Green Park, Bengaluru",
    price: 2499,
    status: "completed",
  },
  {
    id: "BKG-9004",
    customerId: "USR-1003",
    providerId: "PRV-7002",
    vehicleId: "VEH-5004",
    serviceId: "SVC-0005",
    date: "2025-09-05",
    timeSlot: "10:00 AM - 01:00 PM",
    location: "12-A, Palm Grove Apartments, Chennai",
    price: 6999,
    status: "confirmed",
  },
  {
    id: "BKG-9005",
    customerId: "USR-1003",
    providerId: "PRV-7003",
    vehicleId: "VEH-5005",
    serviceId: "SVC-0001",
    date: "2025-08-20",
    timeSlot: "08:00 AM - 10:00 AM",
    location: "12-A, Palm Grove Apartments, Chennai",
    price: 299,
    status: "cancelled",
  },
  {
    id: "BKG-9006",
    customerId: "USR-1002",
    providerId: "PRV-7001",
    vehicleId: "VEH-5003",
    serviceId: "SVC-0002",
    date: "2025-09-10",
    timeSlot: "09:00 AM - 11:00 AM",
    location: "Plot 14, Green Park, Bengaluru",
    price: 399,
    status: "in-progress",
  },
];

// ---------------------------------------------------------------------------
// Convenience lookups & helpers
// Small, pure helper functions so every developer filters data the same way
// instead of re-writing .find()/.filter() logic in every component.
// These are safe to delete/replace once real API endpoints exist.
// ---------------------------------------------------------------------------

export const getUserById = (userId) => users.find((u) => u.id === userId);

export const getVehicleById = (vehicleId) =>
  vehicles.find((v) => v.id === vehicleId);

export const getServiceById = (serviceId) =>
  services.find((s) => s.id === serviceId);

export const getProviderById = (providerId) =>
  providers.find((p) => p.id === providerId);

export const getProviderByUserId = (userId) =>
  providers.find((p) => p.userId === userId);

export const getVehiclesByCustomerId = (customerId) =>
  vehicles.filter((v) => v.customerId === customerId);

export const getBookingsByCustomerId = (customerId) =>
  bookings.filter((b) => b.customerId === customerId);

export const getBookingsByProviderId = (providerId) =>
  bookings.filter((b) => b.providerId === providerId);

// Returns a booking "joined" with its related user, vehicle, service, and
// provider records, similar to what a backend API might return after joins.
export const getEnrichedBooking = (bookingId) => {
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  const provider = getProviderById(booking.providerId);

  return {
    ...booking,
    customer: getUserById(booking.customerId),
    vehicle: getVehicleById(booking.vehicleId),
    service: getServiceById(booking.serviceId),
    provider,
    providerUser: provider ? getUserById(provider.userId) : null,
  };
};

export const getAllEnrichedBookings = () =>
  bookings.map((b) => getEnrichedBooking(b.id));

// Default export bundles everything together for cases where a component
// wants the whole dataset at once (e.g. an admin "seed/reset data" screen).
export default {
  users,
  vehicles,
  services,
  providers,
  bookings,
  getUserById,
  getVehicleById,
  getServiceById,
  getProviderById,
  getProviderByUserId,
  getVehiclesByCustomerId,
  getBookingsByCustomerId,
  getBookingsByProviderId,
  getEnrichedBooking,
  getAllEnrichedBookings,
};