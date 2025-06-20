import React, { useState, useEffect } from 'react';

const ActivityForm = ({ activity, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        category: '',
        description: '',
        address: '',
        openingHours: '',
        price: '',
        duration: '',
        rating: '',
        image: '',
        coordinates: {
            lat: '',
            lng: ''
        }
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (activity && isEditing) {
            setFormData({
                name: activity.name || '',
                city: activity.city || '',
                category: activity.category || '',
                description: activity.description || '',
                address: activity.address || '',
                openingHours: activity.openingHours || '',
                price: activity.price || '',
                duration: activity.duration || '',
                rating: activity.rating || '',
                image: activity.image || '',
                coordinates: {
                    lat: activity.coordinates?.lat || '',
                    lng: activity.coordinates?.lng || ''
                }
            });
        }
    }, [activity, isEditing]);

    const categories = [
        'Kultura',
        'Historia',
        'Przyroda',
        'Rozrywka',
        'Sport',
        'Gastronomia',
        'Sztuka',
        'Architektura',
        'Muzea',
        'Parki',
        'Inne'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'lat' || name === 'lng') {
            setFormData(prev => ({
                ...prev,
                coordinates: {
                    ...prev.coordinates,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Usuń błąd dla tego pola
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nazwa jest wymagana';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Miasto jest wymagane';
        }

        if (!formData.category) {
            newErrors.category = 'Kategoria jest wymagana';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Opis jest wymagany';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Adres jest wymagany';
        }

        if (formData.price && isNaN(formData.price)) {
            newErrors.price = 'Cena musi być liczbą';
        }

        if (formData.duration && isNaN(formData.duration)) {
            newErrors.duration = 'Czas trwania musi być liczbą';
        }

        if (formData.rating && (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5)) {
            newErrors.rating = 'Ocena musi być liczbą między 0 a 5';
        }

        if (formData.coordinates.lat && isNaN(formData.coordinates.lat)) {
            newErrors.lat = 'Szerokość geograficzna musi być liczbą';
        }

        if (formData.coordinates.lng && isNaN(formData.coordinates.lng)) {
            newErrors.lng = 'Długość geograficzna musi być liczbą';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Przygotuj dane do wysłania
        const submitData = {
            ...formData,
            price: formData.price ? parseFloat(formData.price) : undefined,
            duration: formData.duration ? parseInt(formData.duration) : undefined,
            rating: formData.rating ? parseFloat(formData.rating) : undefined,
            coordinates: {
                lat: formData.coordinates.lat ? parseFloat(formData.coordinates.lat) : undefined,
                lng: formData.coordinates.lng ? parseFloat(formData.coordinates.lng) : undefined
            }
        };

        // Usuń puste wartości
        Object.keys(submitData).forEach(key => {
            if (submitData[key] === '' || submitData[key] === undefined) {
                delete submitData[key];
            }
        });

        if (submitData.coordinates.lat === undefined && submitData.coordinates.lng === undefined) {
            delete submitData.coordinates;
        }

        onSubmit(submitData);
    };

    return (
        <div className="activity-form">
            <h3>{isEditing ? 'Edytuj atrakcję' : 'Dodaj nową atrakcję'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Nazwa *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">Miasto *</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">Kategoria *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={errors.category ? 'error' : ''}
                        >
                            <option value="">Wybierz kategorię</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="rating">Ocena (0-5)</label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={handleChange}
                            className={errors.rating ? 'error' : ''}
                        />
                        {errors.rating && <span className="error-message">{errors.rating}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Opis *</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Adres *</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="openingHours">Godziny otwarcia</label>
                        <input
                            type="text"
                            id="openingHours"
                            name="openingHours"
                            placeholder="np. 9:00 - 18:00"
                            value={formData.openingHours}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Cena (PLN)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className={errors.price ? 'error' : ''}
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="duration">Czas trwania (minuty)</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            min="0"
                            value={formData.duration}
                            onChange={handleChange}
                            className={errors.duration ? 'error' : ''}
                        />
                        {errors.duration && <span className="error-message">{errors.duration}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">URL zdjęcia</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="lat">Szerokość geograficzna</label>
                        <input
                            type="number"
                            id="lat"
                            name="lat"
                            step="any"
                            value={formData.coordinates.lat}
                            onChange={handleChange}
                            className={errors.lat ? 'error' : ''}
                        />
                        {errors.lat && <span className="error-message">{errors.lat}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lng">Długość geograficzna</label>
                        <input
                            type="number"
                            id="lng"
                            name="lng"
                            step="any"
                            value={formData.coordinates.lng}
                            onChange={handleChange}
                            className={errors.lng ? 'error' : ''}
                        />
                        {errors.lng && <span className="error-message">{errors.lng}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Anuluj
                    </button>
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Zapisz zmiany' : 'Dodaj atrakcję'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActivityForm;
