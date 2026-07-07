import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeam, createTeam, updateTeam } from '../api/client';
import './TeamFormPage.css';

const emptyForm = { name: '', city: '', abbreviation: '', stadium_name: '', stadium_image_url: '', logo_url: '' };

function TeamFormPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(teamId);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    getTeam(teamId).then((team) => {
      setFormData({
        name: team.name ?? '',
        city: team.city ?? '',
        abbreviation: team.abbreviation ?? '',
        stadium_name: team.stadium_name ?? '',
        stadium_image_url: team.stadium_image_url ?? '',
        logo_url: team.logo_url ?? '',
      });
    }).finally(() => setLoading(false));
  }, [teamId, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSaving(true);

    const payload = {
      name: formData.name,
      city: formData.city || null,
      abbreviation: formData.abbreviation || null,
      stadium_name: formData.stadium_name,
      stadium_image_url: formData.stadium_image_url || null,
      logo_url: formData.logo_url || null,
    };

    try {
      const result = isEditMode
        ? await updateTeam(teamId, payload)
        : await createTeam(payload);
      navigate(`/teams/${result.id}`);
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

  if (loading) return <p>Loading team...</p>;

  return (
    <div className="team-form-page">
      <h1>{isEditMode ? 'Edit Team' : 'New Team'}</h1>

      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-row">
          <label>
            Team Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            City
            <input name="city" value={formData.city} onChange={handleChange} />
          </label>
        </div>

        <div className="form-row">
          <label>
            Abbreviation
            <input name="abbreviation" value={formData.abbreviation} onChange={handleChange} maxLength={5} />
          </label>
          <label>
            Stadium Name
            <input name="stadium_name" value={formData.stadium_name} onChange={handleChange} required />
          </label>
          <label>
            Stadium Image URL
            <input name="stadium_image_url" value={formData.stadium_image_url} onChange={handleChange} placeholder="/stadiums/wild-pigs-stadium.png" />
          </label>
        </div>

        <label>
          Logo URL
          <input name="logo_url" value={formData.logo_url} onChange={handleChange} placeholder="/team-logos/abbreviation.png" />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEditMode ? 'Update Team' : 'Create Team'}
        </button>
      </form>
    </div>
  );
}

export default TeamFormPage;