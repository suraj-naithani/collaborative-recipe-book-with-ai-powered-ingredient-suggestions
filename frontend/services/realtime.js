import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL);

export const connectToRoom = (roomId, userId, dispatch, updateRecipe) => {
  socket.emit('joinRoom', { roomId, userId });

  socket.on('updateRecipe', (updatedRecipe) => {
    if(updatedRecipe.userId !== userId) {
        dispatch(updateRecipe(updatedRecipe));
    }
  });

  socket.on('userJoined', (user) => {
    //Handle User Joined Notification
  });

  socket.on('userLeft', (user) => {
    //Handle User Left Notification
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return () => {
    socket.emit('leaveRoom', { roomId, userId });
    socket.off('updateRecipe');
    socket.off('userJoined');
    socket.off('userLeft');
    socket.off('disconnect');
    socket.disconnect();
  };
};


export const sendRecipeUpdate = (recipe) => {
    socket.emit('updateRecipe', recipe);
};

export const getInitialRecipe = (roomId, dispatch, setRecipe) => {
    socket.emit('getInitialRecipe', roomId);
    socket.on('initialRecipe', (recipe) => {
        dispatch(setRecipe(recipe));
    });
};


export default { connectToRoom, sendRecipeUpdate, getInitialRecipe };