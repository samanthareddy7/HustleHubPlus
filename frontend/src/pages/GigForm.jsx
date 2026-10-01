import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createGig,
    getGigById,
    updateGig
} from "../services/api";


function GigForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        isActive: true
    });

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!isEditing) {
            return;
        }

        const loadGig = async () => {

            try {
                setLoading(true);
                setError("");

                const data = await getGigById(id);

                const gig = data.gig;

                setFormData({
                    title: gig.title || "",
                    description: gig.description || "",
                    category: gig.category || "",
                    price: gig.price ?? "",
                    isActive: gig.isActive ?? true
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGig();

    }, [id, isEditing]);

    const handleChange = (event) => {

        const { name, value, type, checked } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox"
                ? checked
                : value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");

            const gigData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                price: Number(formData.price),
                isActive: formData.isActive
            };

            if (isEditing) {

                await updateGig(id, gigData);

            } else {

                await createGig(gigData);

            }

            navigate("/dashboard");

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);

        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-3">
                    Loading gig...
                </p>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

                            <h1 className="fw-bold mb-2">
                                {isEditing
                                    ? "Edit Gig"
                                    : "Create a Gig"}
                            </h1>

                            <p className="text-muted mb-4">
                                {isEditing
                                    ? "Update your service details."
                                    : "Tell clients about the service you offer."}
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label
                                        htmlFor="title"
                                        className="form-label"
                                    >
                                        Gig Title
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Professional Logo Design"
                                        maxLength="100"
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label
                                        htmlFor="description"
                                        className="form-label"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the service you offer..."
                                        maxLength="2000"
                                        required
                                    />

                                    <div className="form-text">
                                        {formData.description.length}/2000
                                        characters
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label
                                            htmlFor="category"
                                            className="form-label"
                                        >
                                            Category
                                        </label>

                                        <select
                                            className="form-select"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select a category
                                            </option>

                                            <option value="Graphic Design">
                                                Graphic Design
                                            </option>

                                            <option value="Web Development">
                                                Web Development
                                            </option>

                                            <option value="Writing">
                                                Writing
                                            </option>

                                            <option value="Marketing">
                                                Marketing
                                            </option>

                                            <option value="Video Editing">
                                                Video Editing
                                            </option>

                                            <option value="Photography">
                                                Photography
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label
                                            htmlFor="price"
                                            className="form-label"
                                        >
                                            Price (R)
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </div>

                                </div>

                                <div className="form-check mb-4">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="isActive"
                                    >
                                        Make this gig active
                                    </label>

                                </div>

                                <div className="d-flex gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            navigate("/dashboard")
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : isEditing
                                                ? "Save Changes"
                                                : "Create Gig"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default GigForm;