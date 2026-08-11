import { useState } from "react";
import { useNavigate } from "react-router-dom";

import './Profile.css';

function Profile({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();

  const [locationSharing, setLocationSharing] = useState(true);
  const [journeySharing, setJourneySharing] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const user = {
    name: 'Mansi Jadhav',
    email: 'mansi@example.com',
    initials: 'MJ',
  };

  const [trustedContacts, setTrustedContacts] = useState([
  {
    id: 1,
    name: "Mom",
    relation: "Mother",
    phone: "+91 XXXXX XXXXX",
    active: true,
  },
  {
    id: 2,
    name: "Tulsi",
    relation: "Friend",
    phone: "+91 XXXXX XXXXX",
    active: true,
  },
]);

const [showAddContact, setShowAddContact] = useState(false);

const [newContact, setNewContact] = useState({
  name: "",
  relation: "",
  phone: "",
});

const handleAddContact = (event) => {
  event.preventDefault();

  if (
    !newContact.name.trim() ||
    !newContact.relation.trim() ||
    !newContact.phone.trim()
  ) {
    return;
  }

  const contact = {
    id: Date.now(),
    name: newContact.name.trim(),
    relation: newContact.relation.trim(),
    phone: newContact.phone.trim(),
    active: true,
  };

  setTrustedContacts((previous) => [
    ...previous,
    contact,
  ]);

  setNewContact({
    name: "",
    relation: "",
    phone: "",
  });

  setShowAddContact(false);
};

const handleDeleteContact = (id) => {
  setTrustedContacts((previous) =>
    previous.filter(
      (contact) => contact.id !== id
    )
  );
};

  return (
    <div className="profile-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <header className="profile-header">

        <button
          className="profile-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="profile-header-title">
          <span>PROFILE</span>
          <h1>Your Disha</h1>
        </div>

        <button
          className="profile-theme-button"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀' : '☾'}
        </button>

      </header>


      {/* =========================================
          PROFILE HERO
      ========================================== */}

      <main className="profile-content">

        <section className="profile-hero">

          <div className="profile-avatar">
            {user.initials}
          </div>

          <div className="profile-user-info">

            <span className="profile-eyebrow">
              DISHA MEMBER
            </span>

            <h2>{user.name}</h2>

            <p>{user.email}</p>

          </div>

          <button
            className="profile-edit-button"
            aria-label="Edit profile"
          >
            ✎
          </button>

        </section>


        {/* =========================================
            SAFETY SETTINGS
        ========================================== */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <span>SAFETY</span>
            <h3>Your safety preferences</h3>
          </div>


          {/* Location sharing */}

          <div className="profile-setting-row">

            <div className="profile-setting-icon location-icon">
              ◎
            </div>

            <div className="profile-setting-content">

              <h4>Location sharing</h4>

              <p>
                Allow Disha to use your location
                during journeys.
              </p>

            </div>

            <button
              className={`profile-toggle ${
                locationSharing ? 'active' : ''
              }`}
              onClick={() =>
                setLocationSharing((previous) => !previous)
              }
              aria-label="Toggle location sharing"
            >
              <span></span>
            </button>

          </div>


          {/* Journey sharing */}

          <div className="profile-setting-row">

            <div className="profile-setting-icon journey-icon">
              ♡
            </div>

            <div className="profile-setting-content">

              <h4>Journey sharing</h4>

              <p>
                Share your active journey with
                trusted contacts.
              </p>

            </div>

            <button
              className={`profile-toggle ${
                journeySharing ? 'active' : ''
              }`}
              onClick={() =>
                setJourneySharing((previous) => !previous)
              }
              aria-label="Toggle journey sharing"
            >
              <span></span>
            </button>

          </div>


          {/* Notifications */}

          <div className="profile-setting-row">

            <div className="profile-setting-icon notification-icon">
              ◌
            </div>

            <div className="profile-setting-content">

              <h4>Safety notifications</h4>

              <p>
                Get alerts about route and journey
                safety.
              </p>

            </div>

            <button
              className={`profile-toggle ${
                notifications ? 'active' : ''
              }`}
              onClick={() =>
                setNotifications((previous) => !previous)
              }
              aria-label="Toggle safety notifications"
            >
              <span></span>
            </button>

          </div>

        </section>


        {/* =========================================
            TRUSTED CONTACTS
        ========================================== */}

        <section className="profile-section">

          <div className="profile-section-heading contact-heading">

            <div>
              <span>PEOPLE YOU TRUST</span>
              <h3>Trusted contacts</h3>
            </div>

            <button
              className="add-contact-button"
              onClick={() => setShowAddContact(true)}
            >
              + Add
            </button>

          </div>
          
          {showAddContact && (
              <form
                className="add-contact-form"
                onSubmit={handleAddContact}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(event) =>
                    setNewContact({
                      ...newContact,
                      name: event.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Relation"
                  value={newContact.relation}
                  onChange={(event) =>
                    setNewContact({
                      ...newContact,
                      relation: event.target.value,
                    })
                  }
                />

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(event) =>
                    setNewContact({
                      ...newContact,
                      phone: event.target.value,
                    })
                  }
                />

                <div className="add-contact-form-actions">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit">
                    Add contact
                  </button>
                </div>
              </form>
            )}

          <div className="trusted-contacts-list">

            {trustedContacts.map((contact) => (
              <div
                className="profile-contact-card"
                key={contact.id}
              >

                <div className="contact-avatar">
                  {contact.name.charAt(0)}
                </div>

                <div className="contact-details">

                  <h4>{contact.name}</h4>

                  <span>
                    {contact.relation}
                  </span>

                  <p>{contact.phone}</p>

                </div>

               <div className="contact-actions">

                {contact.active && (
                  <span className="contact-active">
                    ACTIVE
                  </span>
                )}

                <button
                  type="button"
                  className="contact-delete-button"
                  onClick={() =>
                    handleDeleteContact(contact.id)
                  }
                  aria-label={`Delete ${contact.name}`}
                >
                  ×
                </button>

              </div>

              </div>
            ))}

          </div>

        </section>


        {/* =========================================
            EMERGENCY SETTINGS
        ========================================== */}

        <section className="profile-emergency-card">

          <div className="emergency-card-icon">
            !
          </div>

          <div className="emergency-card-content">

            <span>EMERGENCY SUPPORT</span>

            <h3>
              Your emergency action
            </h3>

            <p>
              Configure what Disha should do when
              you need immediate help.
            </p>

          </div>

          <button
            onClick={() => navigate('/home')}
            className="emergency-settings-button"
          >
            Manage
            <span>→</span>
          </button>

        </section>


        {/* =========================================
            APPEARANCE
        ========================================== */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <span>APPEARANCE</span>
            <h3>Make Disha yours</h3>
          </div>

          <div className="appearance-card">

            <div className="appearance-icon">
              {darkMode ? '☾' : '☀'}
            </div>

            <div className="appearance-copy">

              <h4>
                {darkMode ? 'Dark mode' : 'Light mode'}
              </h4>

              <p>
                Switch the appearance of your Disha
                experience.
              </p>

            </div>

            <button
              className={`profile-toggle ${
                darkMode ? 'active' : ''
              }`}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <span></span>
            </button>

          </div>

        </section>


        {/* =========================================
            ACCOUNT
        ========================================== */}

        <section className="profile-section account-section">

          <div className="profile-menu-row">

            <div>
              <span>ACCOUNT</span>
              <h4>Personal information</h4>
            </div>

            <span>→</span>

          </div>

          <div className="profile-menu-row">

            <div>
              <span>PRIVACY</span>
              <h4>Privacy & permissions</h4>
            </div>

            <span>→</span>

          </div>

          <div className="profile-menu-row">

            <div>
              <span>ABOUT</span>
              <h4>About Disha</h4>
            </div>

            <span>→</span>

          </div>

        </section>


        {/* =========================================
            LOGOUT
        ========================================== */}

        <button
          className="profile-logout-button"
          onClick={() => navigate('/login')}
        >
          Log out
        </button>


        <p className="profile-version">
          DISHA • Safety that stays with you
          <br />
          Version 1.0.0
        </p>

      </main>

    </div>
  );
}

export default Profile;