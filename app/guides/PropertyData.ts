import { PropertyStatus, PropertyType } from "./Guides";


export const propertyTypes: PropertyType[] = [
  {
    label: "Residential",
    value: "Residential",
    subOptions: [
      { label: "Bungalows", value: "Bungalows" },
      { label: "Mansions", value: "Mansions" },
      { label: "Villas", value: "Villas" },
      { label: "Town Houses", value: "Town Houses" },
      { label: "Duplexes", value: "Duplexes" },
      { label: "Apartments", value: "Apartments" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Commercial",
    value: "Commercial",
    subOptions: [
      { label: "Office Spaces", value: "Office Spaces" },
      { label: "Shops", value: "shops" },
      { label: "Stalls", value: "Stalls" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Industrial",
    value: "Industrial",
    subOptions: [
      { label: "Warehouses", value: "Warehouses" },
      { label: "Go Downs", value: "Go Downs" },
      { label: "Parks", value: "Parks" },
      { label: "Flex Spaces", value: "Flex Spaces" },
    ],
  },
  {
    label: "Vacational / Social",
    value: "Vacational / Social",
    subOptions: [
      { label: "Airbnbs", value: "Airbnbs" },
      { label: "Cabins", value: "Cabins" },
      { label: "Cottages", value: "Cottages" },
      { label: "Vacational Homes", value: "Vacational Homes" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Land",
    value: "Land",
    subOptions: [
      { label: "Plots", value: "Plots" },
      { label: "Farms", value: "Farms" },
      { label: "Others", value: "Others" },
    ],
  },
];

export const propertyStatuses: PropertyStatus[] = [
  { value: "sale", label: "Sale" },
  { value: "let", label: "Let" },
];
