import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather } from 'lucide-react';

const QuickDraftFAB = ({ onAuthClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (!user) {
            if (onAuthClick) onAuthClick();
            return;
        }
        navigate('/write');
    };

    return (
        <button
            className="quick-draft-fab"
            onClick={handleClick}
            title="Write a story"
            aria-label="Write a new story"
        >
            <Feather size={22} />
            <span className="fab-label">Write</span>
        </button>
    );
};

export default QuickDraftFAB;
