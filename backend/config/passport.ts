import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../src/models/index.js';
import env from './env.js';

interface JwtPayload {
  id: number;
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  'jwt',
  new JwtStrategy(options, async (jwt_payload: JwtPayload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (!user) {
        console.warn(`Пользователь с ID ${jwt_payload.id} не найден`);
        return done(null, false);
      }
      // Передаем только id и role
      return done(null, { id: user.id, role: user.role });
    } catch (err) {
      console.error('Ошибка при аутентификации JWT:', err);
      return done(err, false);
    }
  }),
);

export default passport;
