import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayer, createPlayer, updatePlayer, getTeams } from '../api/client';
import { POSITIONS, PITCHER_POSITIONS, CHEMISTRY_TYPES, PITCH_TYPES, TRAIT_CHEMISTRY, RATINGS, THROW_HANDS, BAT_HANDS } from '../constants';
import './PlayerFormPage.css';

const emptyForm = {
  first_name: '', last_name: '', jersey_number: '', card_photo_url: '',
  team_id: '', primary_position: '', secondary_positions: [], chemistry_type: '', rating: '',
  traits: [], power: '', contact: '', speed: '', fielding: '', arm: '',
  velocity: '', junk: '', accuracy: '', pitch_arsenal: [], age: '', throw_hand: '', bat_hand: ''
};

function PlayerFormPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(playerId);

  const [formData, setFormData] = useState(emptyForm);
  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTeams().then(setTeams).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    getPlayer(playerId).then((player) => {
      setFormData({
        first_name: player.first_name ?? '',
        last_name: player.last_name ?? '',
        jersey_number: player.jersey_number ?? '',
        age: player.age ?? '',
        throw_hand: player.throw_hand ?? '',
        bat_hand: player.bat_hand ?? '',
        card_photo_url: player.card_photo_url ?? '',
        team_id: player.team_id ?? '',
        primary_position: player.primary_position ?? '',
        secondary_positions: player.secondary_positions ?? [],
        chemistry_type: player.chemistry_type ?? '',
        traits: player.traits ?? [],
        rating: player.rating ?? '',
        power: player.power ?? '', contact: player.contact ?? '',
        speed: player.speed ?? '', fielding: player.fielding ?? '',
        arm: player.arm ?? '', velocity: player.velocity ?? '',
        junk: player.junk ?? '', accuracy: player.accuracy ?? '',
        pitch_arsenal: player.pitch_arsenal ?? [],
      });
    }).finally(() => setLoading(false));
  }, [playerId, isEditMode]);

  const isPitcher = PITCHER_POSITIONS.has(formData.primary_position);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // toggles a value in/out of an array field, enforcing a max count
  const toggleArrayValue = (field, value, max) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      if (current.length >= max) return prev; // ignore if at max
      return { ...prev, [field]: [...current, value] };
    });
  };

  const toInt = (val) => (val === '' || val === null ? null : parseInt(val, 10));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSaving(true);

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      jersey_number: toInt(formData.jersey_number),
      age: toInt(formData.age),
      throw_hand: formData.throw_hand,
      bat_hand: formData.bat_hand,
      card_photo_url: formData.card_photo_url || null,
      team_id: toInt(formData.team_id),
      primary_position: formData.primary_position,
      secondary_positions: isPitcher ? null : (formData.secondary_positions.length ? formData.secondary_positions : null),
      chemistry_type: formData.chemistry_type,
      traits: formData.traits.length ? formData.traits : null,
      rating: formData.rating,
      power: toInt(formData.power),
      contact: toInt(formData.contact),
      speed: toInt(formData.speed),
      fielding: toInt(formData.fielding),
      arm: isPitcher ? null : toInt(formData.arm),
      velocity: isPitcher ? toInt(formData.velocity) : null,
      junk: isPitcher ? toInt(formData.junk) : null,
      accuracy: isPitcher ? toInt(formData.accuracy) : null,
      pitch_arsenal: isPitcher && formData.pitch_arsenal.length ? formData.pitch_arsenal : null,
    };

    try {
      const result = isEditMode
        ? await updatePlayer(playerId, payload)
        : await createPlayer(payload);
      navigate(`/players/${result.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setErrors(detail.map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`));
      } else if (typeof detail === 'string') {
        setErrors([detail]);
      } else {
        setErrors(['Something went wrong. Check the console for details.']);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading player...</p>;

  return (
    <div className="player-form-page">
      <h1>{isEditMode ? 'Edit Player' : 'New Player'}</h1>

      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="player-form">
        <div className="form-row">
          <label>
            First Name
            <input name="first_name" value={formData.first_name} onChange={handleChange} required />
          </label>
          <label>
            Last Name
            <input name="last_name" value={formData.last_name} onChange={handleChange} required />
          </label>
        </div>

        <div className="form-row">
          <label>
            Jersey Number
            <input type="number" name="jersey_number" value={formData.jersey_number} onChange={handleChange} />
          </label>
          <label>
            Age
            <input type="number" min="18" max="49" name="age" value={formData.age} onChange={handleChange} required />
          </label>
          <label>
            Bats
            <select name="bat_hand" value={formData.bat_hand} onChange={handleChange} required>
              <option value="">Select...</option>
              {BAT_HANDS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </label>
          <label>
            Throws
            <select name="throw_hand" value={formData.throw_hand} onChange={handleChange} required>
              <option value="">Select...</option>
              {THROW_HANDS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </label>
          <label>
            Card Photo URL
            <input name="card_photo_url" value={formData.card_photo_url} onChange={handleChange} placeholder="/player-cards/lastname-firstname.png" />
          </label>
        </div>

        <label>
          Team
          <select name="team_id" value={formData.team_id} onChange={handleChange}>
            <option value="">Free Agent</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.abbreviation})</option>
            ))}
          </select>
        </label>

        <div className="form-row">
          <label>
            Primary Position
            <select name="primary_position" value={formData.primary_position} onChange={handleChange} required>
              <option value="">Select...</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label>
            Chemistry Type
            <select name="chemistry_type" value={formData.chemistry_type} onChange={handleChange} required>
              <option value="">Select...</option>
              {CHEMISTRY_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            Rating
            <select name="rating" value={formData.rating} onChange={handleChange} required>
              <option value="">Select...</option>
              {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
        </div>

        {!isPitcher && (
          <fieldset>
            <legend>Secondary Positions (up to 2)</legend>
            <div className="checkbox-grid">
              {POSITIONS.map((p) => (
              <label key={p} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.secondary_positions.includes(p)}
                  onChange={() => toggleArrayValue('secondary_positions', p, 2)}
                />
                {p}
              </label>
            ))}
          </div>
        </fieldset>
        )}
        <h2>Stats (0-99)</h2>
        <div className="form-row stat-row">
          <label>Power <input type="number" min="0" max="99" name="power" value={formData.power} onChange={handleChange} /></label>
          <label>Contact <input type="number" min="0" max="99" name="contact" value={formData.contact} onChange={handleChange} /></label>
          <label>Speed <input type="number" min="0" max="99" name="speed" value={formData.speed} onChange={handleChange} /></label>
          <label>Fielding <input type="number" min="0" max="99" name="fielding" value={formData.fielding} onChange={handleChange} /></label>
        </div>

        {isPitcher ? (
          <>
            <div className="form-row stat-row">
              <label>Velocity <input type="number" min="0" max="99" name="velocity" value={formData.velocity} onChange={handleChange} /></label>
              <label>Junk <input type="number" min="0" max="99" name="junk" value={formData.junk} onChange={handleChange} /></label>
              <label>Accuracy <input type="number" min="0" max="99" name="accuracy" value={formData.accuracy} onChange={handleChange} /></label>
            </div>

            <fieldset>
              <legend>Pitch Arsenal (1-6)</legend>
              <div className="checkbox-grid">
                {PITCH_TYPES.map((p) => (
                  <label key={p} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.pitch_arsenal.includes(p)}
                      onChange={() => toggleArrayValue('pitch_arsenal', p, 6)}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        ) : (
          <div className="form-row stat-row">
            <label>Arm <input type="number" min="0" max="99" name="arm" value={formData.arm} onChange={handleChange} /></label>
          </div>
        )}

        <fieldset>
          <legend>Traits (up to 2)</legend>
          <div className="checkbox-grid">
            {Object.keys(TRAIT_CHEMISTRY).map((trait) => (
              <label key={trait} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.traits.includes(trait)}
                  onChange={() => toggleArrayValue('traits', trait, 2)}
                />
                {trait} <span className="trait-chem">({TRAIT_CHEMISTRY[trait]})</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEditMode ? 'Update Player' : 'Create Player'}
        </button>
      </form>
    </div>
  );
}

export default PlayerFormPage;