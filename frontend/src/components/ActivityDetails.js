import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityDetails, addComment, deleteComment } from '../services/commentService';
import { useAuth } from '../hooks/useAuth';
import '../style/ActivityDetails.css';

const ActivityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [activity, setActivity] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    
    // Stan formularza komentarza
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [newComment, setNewComment] = useState({
        komentarz: '',
        ocena: 5
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchActivityDetails();
    }, [id]);

    const fetchActivityDetails = async () => {
        try {
            setLoading(true);
            const data = await getActivityDetails(id);
            setActivity(data.activity);
            setComments(data.comments || []);
            setAverageRating(data.averageRating || 0);
            setCommentCount(data.commentCount || 0);
            setError(null);
        } catch (err) {
            setError('Błąd podczas pobierania szczegółów atrakcji: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Musisz być zalogowany, aby dodać komentarz');
            return;
        }

        if (!newComment.komentarz.trim()) {
            alert('Komentarz nie może być pusty');
            return;
        }

        try {
            setSubmitting(true);
            await addComment(id, newComment);
            setNewComment({ komentarz: '', ocena: 5 });
            setShowCommentForm(false);
            await fetchActivityDetails(); // Odśwież dane
            alert('Komentarz został dodany');
        } catch (err) {
            alert('Błąd podczas dodawania komentarza: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
            return;
        }

        try {
            await deleteComment(commentId);
            await fetchActivityDetails(); // Odśwież dane
            alert('Komentarz został usunięty');
        } catch (err) {
            alert('Błąd podczas usuwania komentarza: ' + err.message);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                    <span 
                        key={star} 
                        className={`star ${star <= rating ? 'filled' : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Ładowanie szczegółów atrakcji...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error">{error}</div>
                <button onClick={() => navigate(-1)} className="btn-back">
                    Powrót
                </button>
            </div>
        );
    }    if (!activity) {
        return (
            <div className="error-container">
                <div className="error">Atrakcja nie została znaleziona</div>
                <button onClick={() => navigate(-1)} className="btn-back">
                    Powrót
                </button>
            </div>
        );
    }    return (
        <div className="activity-details">
            {/* Zdjęcie atrakcji z headerem na górze */}
            <div className="activity-image-container">
                <div className="activity-header-overlay">
                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Powrót
                    </button>
                    <h1>{activity.nazwa_atrakcji}</h1>
                </div>
                <img 
                    src={`/activities/${activity.id_atrakcji}.jpg`}
                    alt={activity.nazwa_atrakcji}
                    className="activity-main-image"
                    onError={(e) => {
                        e.target.src = '/activities/1.jpg'; // fallback image
                        e.target.onerror = null; // prevent infinite loop
                    }}
                />
            </div>

            {/* Główna sekcja z informacjami i opiniami obok siebie */}
            <div className="main-content">                {/* Informacje o atrakcji */}
                <div className="activity-info">
                    <div className="info-section">
                        <h3>Informacje podstawowe</h3>
                        <div className="basic-info">
                            <div className="info-row">
                                <strong>Ocena ogólna:</strong> 
                                <span className="rating-display">
                                    {renderStars(Math.round(averageRating))}
                                    <span className="rating-number">
                                        {averageRating}/5 ({commentCount} {commentCount === 1 ? 'opinia' : 'opinii'})
                                    </span>
                                </span>
                            </div>
                            <div className="info-row">
                                <strong>Czas trwania:</strong> <span>{activity.czas_trwania}h</span>
                            </div>
                            <div className="info-row">
                                <strong>Cena:</strong> <span>{activity.cena} zł</span>
                            </div>
                            <div className="info-row">
                                <strong>Sezon:</strong> <span>{activity.sezon}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Opis</h3>
                        <p className="description">{activity.opis}</p>
                    </div>

                    <div className="info-section">
                        <h3>Godziny otwarcia</h3>
                        <div className="opening-hours">
                            <div className="hours-row">
                                <strong>Dni robocze:</strong> <span>{activity.godziny_otwarcia?.dni_robiocze}</span>
                            </div>
                            <div className="hours-row">
                                <strong>Weekend:</strong> <span>{activity.godziny_otwarcia?.weekend}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Szczegółowe oceny</h3>
                        <div className="detailed-ratings">
                            <div className="rating-row">
                                <span>Aktywność:</span>
                                <span className="rating-value">{activity.aktywnosc}/10</span>
                            </div>
                            <div className="rating-row">
                                <span>Centrum:</span>
                                <span className="rating-value">{activity.centrum}/10</span>
                            </div>
                            <div className="rating-row">
                                <span>Zatłoczenie:</span>
                                <span className="rating-value">{activity.zatloczenie}/10</span>
                            </div>
                            <div className="rating-row">
                                <span>Adrenalina:</span>
                                <span className="rating-value">{activity.adrenalina}/10</span>
                            </div>
                            <div className="rating-row">
                                <span>Pamiątki:</span>
                                <span className="rating-value">{activity.dostepnosc_pamiatek}/10</span>
                            </div>
                        </div>
                    </div>

                    {activity.tagi && activity.tagi.length > 0 && (
                        <div className="info-section">
                            <h3>Tagi</h3>
                            <div className="tags">
                                {activity.tagi.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {activity.uslugi && activity.uslugi.length > 0 && (
                        <div className="info-section">
                            <h3>Usługi</h3>
                            <div className="services">
                                {activity.uslugi.map((usluga, index) => (
                                    <span key={index} className="service">{usluga}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sekcja komentarzy obok informacji */}
                <div className="comments-section">
                    <div className="comments-header">
                        <h3>Opinie ({commentCount})</h3>
                        {user && (
                            <button 
                                onClick={() => setShowCommentForm(!showCommentForm)}
                                className="btn-add-comment"
                            >
                                {showCommentForm ? 'Anuluj' : 'Dodaj opinię'}
                            </button>
                        )}
                        {!user && (
                            <p className="login-prompt">
                                <a href="/login">Zaloguj się</a>, aby dodać opinię
                            </p>
                        )}
                    </div>

                    {showCommentForm && (
                        <form onSubmit={handleAddComment} className="comment-form">
                            <div className="form-group">
                                <label>Ocena:</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${star <= newComment.ocena ? 'active' : ''}`}
                                            onClick={() => setNewComment({...newComment, ocena: star})}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Komentarz:</label>
                                <textarea
                                    value={newComment.komentarz}
                                    onChange={(e) => setNewComment({...newComment, komentarz: e.target.value})}
                                    placeholder="Podziel się swoją opinią o tej atrakcji..."
                                    rows="4"
                                    maxLength="1000"
                                    required
                                />
                                <small>{newComment.komentarz.length}/1000 znaków</small>
                            </div>
                            <button type="submit" disabled={submitting} className="btn-submit">
                                {submitting ? 'Dodawanie...' : 'Dodaj opinię'}
                            </button>
                        </form>
                    )}

                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">Brak opinii dla tej atrakcji</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment._id} className="comment">
                                    <div className="comment-header">
                                        <div className="comment-author">
                                            <strong>{comment.username}</strong>
                                            {renderStars(comment.ocena)}
                                        </div>
                                        <div className="comment-meta">
                                            <span className="comment-date">
                                                {new Date(comment.data_utworzenia).toLocaleDateString('pl-PL')}
                                            </span>
                                            {(user && (user.id === comment.user_id || user.role === 'admin')) && (
                                                <button 
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="btn-delete-comment"
                                                    title="Usuń komentarz"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="comment-text">{comment.komentarz}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
