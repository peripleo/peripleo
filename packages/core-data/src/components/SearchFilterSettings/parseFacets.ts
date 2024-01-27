import { jwtDecode } from 'jwt-decode';

interface Facet {
  
  value: string;
  
  displayLabel: string;
  
  show: boolean;  
  
  uuid?: string;

  isUserDefined: boolean;

}

/**
 * Facet label formatting utility: replaces underscores with whitespace
 * and capitalizes the resulting string. Turns e.g. 'related_places' to
 * 'Related Places'.
 */
const splitAndCapitalize = (str: string) => 
  str
    .trim()
    .replace('_', ' ')
    .split(/[\s_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const parseFacet = (value: string): Facet => {
  const normalized = value.endsWith('_facet') ?
    value.substring(0, value.lastIndexOf('_facet')) : value;

  if (normalized.startsWith('ey')) {
    // JWT token facets like this one:
    // eyJhbGciOiJub25lIn0.eyJ1dWlkIjoiMDkwMjdkNTMtNmNjYy00MTEwLWE1MDct...
    const { label, facet, uuid } = jwtDecode<{ label: string, facet: boolean, uuid: string }>(normalized);
    return { 
      value, 
      displayLabel: label,
      show: facet,
      uuid,
      isUserDefined: true
    };
  } else if (normalized.includes('.ey')) {
    // JWT token facets for related items, like this one:
    // related_places.eyJhbGciOiJub25lIn0.eyJ1dWlkIjoiMDkwMjdkNTMtNmNjYy00MTEw...
    const { 
      label, 
      facet, 
      uuid 
    } = jwtDecode<{ label: string, facet: boolean, uuid: string }>(normalized.substring(value.indexOf('.ey') + 1));
    
    const prefix = splitAndCapitalize(normalized.substring(0, normalized.indexOf('.')))

    return { 
      value, 
      displayLabel: `${prefix}: ${label}`,
      show: facet,
      uuid,
      isUserDefined: true
    };
  } else {
    const prefix = splitAndCapitalize(normalized.substring(0, value.indexOf('.')));
    const suffix = splitAndCapitalize(normalized.substring(value.indexOf('.') + 1));
    
    // Not a user-defined JWT facet
    return {
      value,
      displayLabel: prefix ? `${prefix}: ${suffix}` : suffix,
      show: true,
      isUserDefined: false
    }
  }
}