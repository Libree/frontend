import {gql} from '@apollo/client';

export const PLUGIN_DATA_QUERY = gql`
query Dao($address: ID!) {
    dao(id: $address){
      id
      subdomain
      metadata
      createdAt
      plugins{
        appliedPreparation {
          pluginAddress
        }
        appliedPluginRepo {
          subdomain
        }
        appliedVersion{
          build
          release {
            release
          }
        }
      }
    }
  }
`;
