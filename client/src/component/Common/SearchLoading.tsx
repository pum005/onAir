import Spinner from '../../assets/Magnify-0.9s-117px.svg';
import styles from '../Common/SearchLoading.module.css'; // CSS 모듈을 import

const SearchLoading = () => {
    return (
        <div className={styles.SearchloadingOverlay}>
            <div className={styles.SearchloadingContainer}>
                <h1>검색중</h1>
                <img src={Spinner} alt="Spinner" />
            </div>
        </div>
    );
}

export default SearchLoading;