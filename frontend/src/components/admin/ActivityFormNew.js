import React, { useState, useEffect } from 'react';

const ActivityForm = ({ activity, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        nazwa_atrakcji: '',
        id_miasta: '',
        aktywnosc: 5,
        centrum: 5,
        zatloczenie: 5,
        dostepnosc_pamiatek: 5,
        adrenalina: 5,
        cena: 0,
        godziny_otwarcia: {
            dni_robiocze: '',
            weekend: ''
        },
        lokalizacja: {
            szerokosc: '',
            dlugosc: ''
        },
        opis: '',
        sezon: '',
        ocena: 5,
        czas_trwania: 1,
        tagi: [],
        uslugi: []
    });

    const [errors, setErrors] = useState({});
    const [tagiInput, setTagiInput] = useState('');
    const [uslugiInput, setUslugiInput] = useState('');

    useEffect(() => {
        if (activity && isEditing) {
            setFormData({
                nazwa_atrakcji: activity.nazwa_atrakcji || '',
                id_miasta: activity.id_miasta || '',
                aktywnosc: activity.aktywnosc || 5,
                centrum: activity.centrum || 5,
                zatloczenie: activity.zatloczenie || 5,
                dostepnosc_pamiatek: activity.dostepnosc_pamiatek || 5,
                adrenalina: activity.adrenalina || 5,
                cena: activity.cena || 0,
                godziny_otwarcia: {
                    dni_robiocze: activity.godziny_otwarcia?.dni_robiocze || '',
                    weekend: activity.godziny_otwarcia?.weekend || ''
                },
                lokalizacja: {
                    szerokosc: activity.lokalizacja?.szerokosc || '',
                    dlugosc: activity.lokalizacja?.dlugosc || ''
                },
                opis: activity.opis || '',
                sezon: activity.sezon || '',
                ocena: activity.ocena || 5,
                czas_trwania: activity.czas_trwania || 1,
                tagi: activity.tagi || [],
                uslugi: activity.uslugi || []
            });
            setTagiInput(activity.tagi?.join(', ') || '');
            setUslugiInput(activity.uslugi?.join(', ') || '');
        }
    }, [activity, isEditing]);

    const sezony = [
        'Całoroczne',
        'Wiosna',
        'Lato', 
        'Jesień',
        'Zima',
        'Wiosna-Lato',
        'Jesień-Zima'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'szerokosc' || name === 'dlugosc') {
            setFormData(prev => ({
                ...prev,
                lokalizacja: {
                    ...prev.lokalizacja,
                    [name]: parseFloat(value) || ''
                }
            }));
        } else if (name === 'dni_robiocze' || name === 'weekend') {
            setFormData(prev => ({
                ...prev,
                godziny_otwarcia: {
                    ...prev.godziny_otwarcia,
                    [name]: value
                }
            }));
        } else if (name === 'id_miasta' || name === 'aktywnosc' || name === 'centrum' || 
                   name === 'zatloczenie' || name === 'dostepnosc_pamiatek' || 
                   name === 'adrenalina' || name === 'cena' || name === 'ocena' || 
                   name === 'czas_trwania') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
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

    const handleTagiChange = (e) => {
        const value = e.target.value;
        setTagiInput(value);
        const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        setFormData(prev => ({
            ...prev,
            tagi: tagsArray
        }));
    };

    const handleUslugiChange = (e) => {
        const value = e.target.value;
        setUslugiInput(value);
        const servicesArray = value.split(',').map(service => service.trim()).filter(service => service.length > 0);
        setFormData(prev => ({
            ...prev,
            uslugi: servicesArray
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nazwa_atrakcji.trim()) {
            newErrors.nazwa_atrakcji = 'Nazwa atrakcji jest wymagana';
        }

        if (!formData.id_miasta) {
            newErrors.id_miasta = 'ID miasta jest wymagane';
        }

        if (!formData.opis.trim()) {
            newErrors.opis = 'Opis jest wymagany';
        }

        if (!formData.sezon) {
            newErrors.sezon = 'Sezon jest wymagany';
        }

        if (!formData.godziny_otwarcia.dni_robiocze.trim()) {
            newErrors.dni_robiocze = 'Godziny otwarcia w dni robocze są wymagane';
        }

        if (!formData.godziny_otwarcia.weekend.trim()) {
            newErrors.weekend = 'Godziny otwarcia w weekend są wymagane';
        }

        if (!formData.lokalizacja.szerokosc) {
            newErrors.szerokosc = 'Szerokość geograficzna jest wymagana';
        }

        if (!formData.lokalizacja.dlugosc) {
            newErrors.dlugosc = 'Długość geograficzna jest wymagana';
        }

        if (formData.tagi.length === 0) {
            newErrors.tagi = 'Przynajmniej jeden tag jest wymagany';
        }

        if (formData.uslugi.length === 0) {
            newErrors.uslugi = 'Przynajmniej jedna usługa jest wymagana';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="activity-form">
            <h3>{isEditing ? 'Edytuj atrakcję' : 'Dodaj nową atrakcję'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nazwa_atrakcji">Nazwa atrakcji *</label>
                        <input
                            id="nazwa_atrakcji"
                            name="nazwa_atrakcji"
                            type="text"
                            value={formData.nazwa_atrakcji}
                            onChange={handleChange}
                            className={errors.nazwa_atrakcji ? 'error' : ''}
                        />
                        {errors.nazwa_atrakcji && <span className="error-message">{errors.nazwa_atrakcji}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="id_miasta">ID miasta *</label>
                        <input
                            id="id_miasta"
                            name="id_miasta"
                            type="number"
                            value={formData.id_miasta}
                            onChange={handleChange}
                            className={errors.id_miasta ? 'error' : ''}
                        />
                        {errors.id_miasta && <span className="error-message">{errors.id_miasta}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="opis">Opis *</label>
                    <textarea
                        id="opis"
                        name="opis"
                        rows="4"
                        value={formData.opis}
                        onChange={handleChange}
                        className={errors.opis ? 'error' : ''}
                    />
                    {errors.opis && <span className="error-message">{errors.opis}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="sezon">Sezon *</label>
                        <select
                            id="sezon"
                            name="sezon"
                            value={formData.sezon}
                            onChange={handleChange}
                            className={errors.sezon ? 'error' : ''}
                        >
                            <option value="">Wybierz sezon</option>
                            {sezony.map(sezon => (
                                <option key={sezon} value={sezon}>{sezon}</option>
                            ))}
                        </select>
                        {errors.sezon && <span className="error-message">{errors.sezon}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cena">Cena (zł) *</label>
                        <input
                            id="cena"
                            name="cena"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.cena}
                            onChange={handleChange}
                            className={errors.cena ? 'error' : ''}
                        />
                        {errors.cena && <span className="error-message">{errors.cena}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="czas_trwania">Czas trwania (godziny) *</label>
                        <input
                            id="czas_trwania"
                            name="czas_trwania"
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={formData.czas_trwania}
                            onChange={handleChange}
                            className={errors.czas_trwania ? 'error' : ''}
                        />
                        {errors.czas_trwania && <span className="error-message">{errors.czas_trwania}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="ocena">Ocena ogólna (1-10) *</label>
                        <input
                            id="ocena"
                            name="ocena"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.ocena}
                            onChange={handleChange}
                            className={errors.ocena ? 'error' : ''}
                        />
                        {errors.ocena && <span className="error-message">{errors.ocena}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dni_robiocze">Godziny otwarcia - dni robocze *</label>
                        <input
                            id="dni_robiocze"
                            name="dni_robiocze"
                            type="text"
                            placeholder="np. 9:00-17:00"
                            value={formData.godziny_otwarcia.dni_robiocze}
                            onChange={handleChange}
                            className={errors.dni_robiocze ? 'error' : ''}
                        />
                        {errors.dni_robiocze && <span className="error-message">{errors.dni_robiocze}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="weekend">Godziny otwarcia - weekend *</label>
                        <input
                            id="weekend"
                            name="weekend"
                            type="text"
                            placeholder="np. 10:00-16:00"
                            value={formData.godziny_otwarcia.weekend}
                            onChange={handleChange}
                            className={errors.weekend ? 'error' : ''}
                        />
                        {errors.weekend && <span className="error-message">{errors.weekend}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="szerokosc">Szerokość geograficzna *</label>
                        <input
                            id="szerokosc"
                            name="szerokosc"
                            type="number"
                            step="0.000001"
                            placeholder="np. 52.229676"
                            value={formData.lokalizacja.szerokosc}
                            onChange={handleChange}
                            className={errors.szerokosc ? 'error' : ''}
                        />
                        {errors.szerokosc && <span className="error-message">{errors.szerokosc}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dlugosc">Długość geograficzna *</label>
                        <input
                            id="dlugosc"
                            name="dlugosc"
                            type="number"
                            step="0.000001"
                            placeholder="np. 21.012229"
                            value={formData.lokalizacja.dlugosc}
                            onChange={handleChange}
                            className={errors.dlugosc ? 'error' : ''}
                        />
                        {errors.dlugosc && <span className="error-message">{errors.dlugosc}</span>}
                    </div>
                </div>

                <h4>Oceny szczegółowe (0-10)</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="aktywnosc">Aktywność *</label>
                        <input
                            id="aktywnosc"
                            name="aktywnosc"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.aktywnosc}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="centrum">Centrum *</label>
                        <input
                            id="centrum"
                            name="centrum"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.centrum}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="zatloczenie">Zatłoczenie *</label>
                        <input
                            id="zatloczenie"
                            name="zatloczenie"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.zatloczenie}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dostepnosc_pamiatek">Dostępność pamiątek *</label>
                        <input
                            id="dostepnosc_pamiatek"
                            name="dostepnosc_pamiatek"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.dostepnosc_pamiatek}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="adrenalina">Adrenalina *</label>
                        <input
                            id="adrenalina"
                            name="adrenalina"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.adrenalina}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tagi">Tagi * (oddzielone przecinkami)</label>
                        <input
                            id="tagi"
                            name="tagi"
                            type="text"
                            placeholder="np. muzeum, historia, kultura"
                            value={tagiInput}
                            onChange={handleTagiChange}
                            className={errors.tagi ? 'error' : ''}
                        />
                        {errors.tagi && <span className="error-message">{errors.tagi}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="uslugi">Usługi * (oddzielone przecinkami)</label>
                        <input
                            id="uslugi"
                            name="uslugi"
                            type="text"
                            placeholder="np. parking, toalety, kawiarnia"
                            value={uslugiInput}
                            onChange={handleUslugiChange}
                            className={errors.uslugi ? 'error' : ''}
                        />
                        {errors.uslugi && <span className="error-message">{errors.uslugi}</span>}
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
