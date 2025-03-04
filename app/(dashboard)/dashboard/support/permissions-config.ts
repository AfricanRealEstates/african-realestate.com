export const AVAILABLE_PERMISSIONS = [
  {
    value: "blog:write",
    label: "Write Blog Posts",
    description: "Can create and edit blog posts",
  },
  {
    value: "blog:publish",
    label: "Publish Blog Posts",
    description: "Can publish or unpublish blog posts",
  },
  {
    value: "support:respond",
    label: "Respond to Support",
    description: "Can respond to customer support queries",
  },
  {
    value: "support:escalate",
    label: "Escalate Support",
    description: "Can escalate support issues to admins",
  },
  {
    value: "user:view",
    label: "View Users",
    description: "Can view user profiles and information",
  },
  {
    value: "property:moderate",
    label: "Moderate Properties",
    description: "Can moderate property listings",
  },
  {
    value: "comment:moderate",
    label: "Moderate Comments",
    description: "Can moderate user comments",
  },
  {
    value: "notification:send",
    label: "Send Notifications",
    description: "Can send notifications to users",
  },
];

// Helper function to check if a user has a specific permission
export function hasPermission(
  userPermissions: string[],
  permission: string
): boolean {
  return userPermissions.includes(permission);
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(
  userPermissions: string[],
  permissions: string[]
): boolean {
  return permissions.some((permission) => userPermissions.includes(permission));
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(
  userPermissions: string[],
  permissions: string[]
): boolean {
  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
}
