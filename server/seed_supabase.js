const supabase = require('./src/lib/supabase');
const fs = require('fs');

async function seedUsers() {
  try {
    if (!fs.existsSync('./data/users.json')) {
      console.log('users.json not found, skipping seed.');
      return;
    }
    
    const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    
    const { data, error } = await supabase
      .from('users')
      .insert(usersData)
      .select();
      
    if (error) {
      console.error('Error seeding users:', error);
    } else {
      console.log('Users seeded successfully:', data.length);
      // Delete json files as we don't need them anymore
      fs.unlinkSync('./data/users.json');
      if (fs.existsSync('./data/tasks.json')) fs.unlinkSync('./data/tasks.json');
      if (fs.existsSync('./data/completed-tasks.json')) fs.unlinkSync('./data/completed-tasks.json');
      fs.rmdirSync('./data', { recursive: true });
      console.log('Local JSON data removed.');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seedUsers();
