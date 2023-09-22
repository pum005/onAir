import Spinner from '../../assets/Magnify-1s-200px.svg';
import styles from '../Common/Loading.module.css'; // CSS 모듈을 import

const Loading = () => {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingContainer}>
                <h1>음악을 추가하고 있습니다.</h1>
                <img src={Spinner} alt="Spinner" />
            </div>
        </div>
    );
}

export default Loading;