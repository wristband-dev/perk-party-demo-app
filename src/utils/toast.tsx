import { toast } from 'react-toastify';

export const toastSuccess = (message: string, icon: string = '🎉') => {
  toast.success(message, {
    style: {
      backgroundColor: '#000',
      color: '#fff',
      position: 'relative',
      padding: '0.5rem',
      border: '1px solid #f61681',
    },
    progressStyle: { backgroundColor: '#f61681' },
    icon: <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>{icon}</span>,
  });
};

export const toastError = (message: string, icon: string = '😭') => {
  toast.error(message, {
    style: {
      backgroundColor: '#ff4c4c',
      color: '#000',
      position: 'relative',
      padding: '0.5rem',
    },
    progressStyle: { backgroundColor: '#32a852' },
    icon: <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>{icon}</span>,
  });
};
