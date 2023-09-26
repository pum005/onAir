import Spinner from '../../assets/Equalizer-1s-108px.svg';
import styles from '../Common/AddLoading.module.css'; // CSS 모듈을 import

const AddLoading = () => {
    return (
        <div className={styles.AddloadingOverlay}>
            <div className={styles.AddloadingContainer}>
                <h1>음악을 추가하고 있습니다.</h1>
                <img src={Spinner} alt="Spinner" />
            </div>
        </div>
    );
}

export default AddLoading;