export const properyTypes = [
  {
    label: "Residential",
    value: "Residential",
    subOptions: [
      {
        label: "Bungalows",
        value: "Bungalows",
      },
      {
        label: "Mansions",
        value: "Mansions",
      },
      {
        label: "Villas",
        value: "Villas",
      },
      {
        label: "Town Houses",
        value: "Town Houses",
      },
      {
        label: "Apartments",
        value: "Apartments",
      },

      {
        label: "Others",
        value: "Others",
      },
    ],
  },
  {
    label: "Commercial",
    value: "Commercial",
    subOptions: [
      {
        label: "Office Spaces",
        value: "Office Spaces",
      },
      {
        label: "Shops",
        value: "shops",
      },
      {
        label: "Stalls",
        value: "Stalls",
      },
      {
        label: "Others",
        value: "Others",
      },
    ],
  },
  {
    label: "Industrial",
    value: "Industrial",
    subOptions: [
      {
        label: "Warehouses",
        value: "Warehouses",
      },
      {
        label: "Go Downs",
        value: "Go Downs",
      },
      {
        label: "Parks",
        value: "Parks",
      },
      {
        label: "Flex Spaces",
        value: "Flex Spaces",
      },
    ],
  },

  {
    label: "Vacational / Social",
    value: "Vacational / Social",
    subOptions: [
      {
        label: "Cabins",
        value: "Cabins",
      },
      {
        label: "Cottages",
        value: "Cottages",
      },
      {
        label: "Vacational Homes",
        value: "Vacational Homes",
      },
      {
        label: "Others",
        value: "Others",
      },
    ],
  },
  {
    label: "Land",
    value: "Land",
    subOptions: [
      {
        label: "Plots",
        value: "Plots",
      },
      {
        label: "Farms",
        value: "Farms",
      },
      {
        label: "Others",
        value: "Others",
      },
    ],
  },
];

export const propertyStatuses = [
  { value: "sale", label: "Sale" },
  { value: "let", label: "Let" },
];

export const currencyOptions = [
  { value: "KES", label: "KES" },
  { value: "USD", label: "USD" },
];

export const appliances = [
  { value: "parking", label: "Parking" },
  { value: "flower", label: "Flower Garden" },
  { value: "swimming", label: "Swimming Pool" },
  { value: "internet", label: "Internet" },
  { value: "heating", label: "Heating" },
  { value: "dstv", label: "DSTV / Cables" },
  { value: "air", label: "Air Condition" },
  { value: "furnitures", label: "Furnitures" },
  { value: "pet", label: "Pet Friendly" },
  { value: "energy", label: "Energy Efficient" },
  { value: "gates", label: "Gated Estate" },
  { value: "servant", label: "Servant Quarters" },
  { value: "borehole", label: "Borehole" },
];

export const landUnits = [
  // { value: "Unit measurement", text: "Unit measurement" },
  { value: "Sqm", label: "Sqm" },
  { value: "Sqft", label: "Sqft" },
  { value: "ha", label: "ha" },
  { value: "Acres", label: "Acres" },
];

export const subscriptionPlans = [
  {
    name: "Standard",
    sell: "Everything to start",
    price: 0,
    PropertiesLimit: 3,
    imagesPropertiesLimit: 5,
    features: [
      "Free for lifetime",
      "Property Listing",
      "Property Details",
      "5 Images for Property",
      "3 Properties Limit",
      "Property Search",
    ],
  },
  {
    name: "Silver",
    sell: "Everything you need",
    price: 10,
    PropertiesLimit: 10,
    imagesPropertiesLimit: 10,
    features: [
      "Property Listing",
      "Property Details",
      "10 Images for Property",
      "10 Properties Limit",
      "Property Search",
      "24/7 Support",
    ],
  },
  {
    name: "Gold",
    sell: "Everything to sell all",
    price: 50,
    PropertiesLimit: 20,
    imagesPropertiesLimit: 25,
    features: [
      "Property Listing",
      "Property Details",
      "25 Images for Property",
      "20 Properties Limit",
      "Property Search",
      "24/7 Support",
      "Huge Discounts",
      "Personal Account Manager",
    ],
  },
];
