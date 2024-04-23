import { ref, get, remove } from 'firebase/database';
import { firebaseDB } from '@utils/firebaseConfig';
import { getDownloadURL, ref as storageRef, getStorage, uploadString } from 'firebase/storage';
import { zonedTimeToUtc } from 'date-fns-tz';
import IProposal from '@interfaces/IProposal';

export default async function fetchProcessData(processId: string): Promise<any> {
  let process;
  const processRef = ref(firebaseDB, `process/${processId}`);
  const snapshot = await get(processRef);
  if (snapshot.exists()) {
    process = snapshot.val();
    // Check if 'description' key does not exist and 'descriptionId' key exists
    if (!process.description && process.descriptionId) {
      const storage = getStorage();
      const descriptionRef = storageRef(storage, `descriptions/${process.descriptionId}.json`);
      try {
        const downloadURL = await getDownloadURL(descriptionRef);
        const response = await fetch(downloadURL);
        const descriptionContent = await response.json();
        process.description = JSON.parse(descriptionContent);
      } catch (error: any) {
        if (error && error.code === 'storage/object-not-found') {
          // Handle object not found error
          console.error('Object not found in Firebase Storage:', error.message);
        } else {
          // Handle other errors
          console.error('Error fetching description content:', error);
        }
      }
    }
    const timezone = process.timezone || 'UTC';
    const currentTime = new Date();

    if (currentTime > zonedTimeToUtc(process.proposalDates[1], timezone)) {
      if (!process.proposals) return process;
    
      const proposalsObj = process.proposals;
      const storage = getStorage();

      
      await Promise.all(Object.entries(proposalsObj).map(async ([index, proposal] : [string, any]) => {
        let id = proposal.id ? proposal.id : index;
        if (id && proposal.description) {
          const proposalDescriptionRef = storageRef(storage, `proposals/${id}.json`);
          await uploadString(proposalDescriptionRef, JSON.stringify({description: proposal.description}), 'raw');

          const realtimeDescriptionRef = ref(firebaseDB, `process/${processId}/proposals/${id}/description`);
          await remove(realtimeDescriptionRef);
        }
      }));
      
      const updatedProposals = await Promise.all(Object.entries(proposalsObj).map(async ([index, proposal]: [string, any]) => {
        let id = proposal.id ? proposal.id : index;
        if (id && id !== "-1") {
          const proposalDescriptionRef = storageRef(storage, `proposals/${id}.json`);
          try {
            const downloadURL = await getDownloadURL(proposalDescriptionRef);
            const response = await fetch(downloadURL);const descriptionData = await response.json();
            if (typeof descriptionData.description === 'string') {
              try {
                proposal.description = JSON.parse(descriptionData.description);
              } catch (error) {
                console.error('Error parsing description JSON:', error);
                proposal.description = descriptionData.description;
              }
            } else {
              proposal.description = descriptionData.description;
            }
            
            proposal.id = id;
          } catch (error) {
            console.error('Failed to fetch description from Firebase Storage:', error);
            delete proposal.description;
          }
        }
        return proposal;
      }));
      process.proposals = updatedProposals;
    }

  } else {
    process = null;
  }
  return process;
}
