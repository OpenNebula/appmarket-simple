export interface Appliance {
  _id: {
    $oid: string;
  };
  links?: {
    download: {
      href: string;
    };
  };
  name?: string;
  version?: string;
  publisher?: string;
  description?: string;
  short_description?: string;
  tags?: string[];
  format?: string;
  creation_time?: number;
  "os-id"?: string;
  "os-release"?: string;
  "os-arch"?: string;
  hypervisor?: string;
  opennebula_version?: string;
  opennebula_template?: string; // This is a JSON string, consider using `Record<string, unknown>` if parsed
  logo?: string;
  type?: string;
  disks?: string[];
  [key: string]: unknown; // Index signature
}
