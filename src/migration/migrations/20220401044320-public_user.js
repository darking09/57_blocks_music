module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('users').insert(
      {
        email: 'user@public.com',
        password: 'Passwords@',
        isPublic: true
      }
    );
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    await db.collection('albums').deleteOne({email: 'user@public.com'});
  }
};
