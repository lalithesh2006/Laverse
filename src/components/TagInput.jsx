import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Tag, X, Plus } from 'lucide-react';

const TagInput = ({ selectedTags = [], onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchAllTags();
    }, []);

    const fetchAllTags = async () => {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            const { data } = await supabase.from('tags').select('*').order('name');
            setAllTags(data || []);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value.trim()) {
            const filtered = allTags.filter(t =>
                t.name.toLowerCase().includes(value.toLowerCase()) &&
                !selectedTags.includes(t.name)
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const addTag = async (tagName) => {
        const name = tagName.trim().toLowerCase();
        if (!name || selectedTags.includes(name)) return;

        // Create tag if it doesn't exist
        let tag = allTags.find(t => t.name === name);
        if (!tag && isSupabaseConfigured && supabase) {
            const slug = name.replace(/\s+/g, '-');
            const { data } = await supabase.from('tags').insert([{ name, slug }]).select().single();
            if (data) {
                tag = data;
                setAllTags(prev => [...prev, data]);
            }
        }

        onChange([...selectedTags, name]);
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagName) => {
        onChange(selectedTags.filter(t => t !== tagName));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue);
        }
        if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            removeTag(selectedTags[selectedTags.length - 1]);
        }
    };

    return (
        <div className="tag-input-wrapper">
            <label className="tag-input-label"><Tag size={14} /> Tags</label>
            <div className="tag-input-container">
                {selectedTags.map(tag => (
                    <span key={tag} className="tag-chip">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="tag-chip-remove"><X size={12} /></button>
                    </span>
                ))}
                <input
                    type="text"
                    placeholder={selectedTags.length ? 'Add more...' : 'Add tags (press Enter)'}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => inputValue && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="tag-input"
                />
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <div className="tag-suggestions">
                    {suggestions.map(tag => (
                        <button key={tag.id} className="tag-suggestion-item" onClick={() => addTag(tag.name)}>
                            <Plus size={14} /> {tag.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagInput;
