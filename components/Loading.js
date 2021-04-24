import CircularProgress from '@material-ui/core/CircularProgress';

function Loading() {
    const Container = {
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
    };
    const LoadingContainer = {
        display: 'flex',
        flexDirection: 'column',
        justifyItems: 'center',
        alignItems: 'center',
        gap: '30px',
    };
    return (
        <center style={Container}>
            <div style={LoadingContainer}>
                <img
                    src='https://seeklogo.com/images/W/whatsapp-logo-112413FAA7-seeklogo.com.png'
                    width={'50px'}
                    height={'50px'}
                />
                <CircularProgress />
            </div>
        </center>
    );
}

export default Loading;
