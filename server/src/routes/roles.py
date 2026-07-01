# app/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.db import db
from db.models import Role, User, UserRole
from auth import get_current_user
from schemas import RoleResponse, RoleCreate, UserRoleAssignment, UserRolesResponse

router = APIRouter()

# ==================== ROLE CRUD ====================

@router.get("/", response_model=list[RoleResponse])
def get_all_roles(db_s: Session = Depends(db.get_db)):
    """Получить все роли в системе"""
    roles = db_s.query(Role).all()
    return roles

@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db_s: Session = Depends(db.get_db)):
    """Получить роль по ID"""
    role = db_s.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.post("/", response_model=RoleResponse)
def create_role(
    role_data: RoleCreate,
    current_user: User = Depends(get_current_user),
    db_s: Session = Depends(db.get_db)
):
    """Создать новую роль (только для администраторов)"""
    # Проверяем, есть ли у пользователя роль администратора
    admin_role = db_s.query(Role).filter(Role.name == "admin").first()
    if not admin_role or admin_role not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only admins can create roles")
    
    # Проверяем, не существует ли уже роль с таким именем
    existing_role = db_s.query(Role).filter(Role.name == role_data.name).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="Role already exists")
    
    new_role = Role(name=role_data.name, description=role_data.description)
    db_s.add(new_role)
    db_s.commit()
    db_s.refresh(new_role)
    return new_role

@router.put("/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: int,
    role_data: RoleCreate,
    current_user: User = Depends(get_current_user),
    db_s: Session = Depends(db.get_db)
):
    """Обновить роль (только для администраторов)"""
    # Проверяем права администратора
    admin_role = db_s.query(Role).filter(Role.name == "admin").first()
    if not admin_role or admin_role not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only admins can update roles")
    
    role = db_s.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Проверяем, не занято ли имя другой ролью
    if role.name != role_data.name:
        existing_role = db_s.query(Role).filter(Role.name == role_data.name).first()
        if existing_role:
            raise HTTPException(status_code=400, detail="Role name already in use")
    
    role.name = role_data.name
    role.description = role_data.description
    db_s.commit()
    db_s.refresh(role)
    return role

@router.delete("/{role_id}")
def delete_role(
    role_id: int,
    current_user: User = Depends(get_current_user),
    db_s: Session = Depends(db.get_db)
):
    """Удалить роль (только для администраторов)"""
    # Проверяем права администратора
    admin_role = db_s.query(Role).filter(Role.name == "admin").first()
    if not admin_role or admin_role not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only admins can delete roles")
    
    role = db_s.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Не даем удалить системные роли
    if role.name in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Cannot delete system roles")
    
    # Удаляем все связи пользователей с этой ролью
    db_s.query(UserRole).filter(UserRole.role_id == role_id).delete()
    db_s.delete(role)
    db_s.commit()
    return {"detail": "Role deleted successfully"}

# ==================== USER ROLE MANAGEMENT ====================

@router.post("/assign")
def assign_role_to_user(
    assignment: UserRoleAssignment,
    current_user: User = Depends(get_current_user),
    db_s: Session = Depends(db.get_db)
):
    """Назначить роль пользователю (только для администраторов)"""
    # Проверяем права администратора
    admin_role = db_s.query(Role).filter(Role.name == "admin").first()
    if not admin_role or admin_role not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only admins can assign roles")
    
    # Получаем пользователя
    user = db_s.query(User).filter(User.id == assignment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получаем роль по имени
    role = db_s.query(Role).filter(Role.name == assignment.role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Проверяем, есть ли уже такая роль у пользователя
    if role in user.roles:
        raise HTTPException(status_code=400, detail="User already has this role")
    
    # Добавляем роль пользователю
    user.roles.append(role)
    db_s.commit()
    return {"detail": "Role assigned to user successfully"}

@router.post("/revoke")
def revoke_role_from_user(
    assignment: UserRoleAssignment,
    current_user: User = Depends(get_current_user),
    db_s: Session = Depends(db.get_db)
):
    """Отозвать роль у пользователя (только для администраторов)"""
    # Проверяем права администратора
    admin_role = db_s.query(Role).filter(Role.name == "admin").first()
    if not admin_role or admin_role not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only admins can revoke roles")
    
    # Получаем пользователя
    user = db_s.query(User).filter(User.id == assignment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получаем роль по имени
    role = db_s.query(Role).filter(Role.name == assignment.role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Проверяем, есть ли такая роль у пользователя
    if role not in user.roles:
        raise HTTPException(status_code=400, detail="User does not have this role")
    
    # Не даем отозвать последнюю роль администратора
    if role.name == "admin" and len(user.roles) == 1:
        raise HTTPException(status_code=400, detail="Cannot revoke the only admin role")
    
    # Удаляем роль у пользователя
    user.roles.remove(role)
    db_s.commit()
    return {"detail": "Role revoked from user successfully"}

@router.get("/user/{user_id}", response_model=UserRolesResponse)
def get_user_roles(
    user_id: int,
    db_s: Session = Depends(db.get_db)
):
    """Получить все роли пользователя"""
    user = db_s.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserRolesResponse(user_id=user.id, roles=user.roles)

@router.get("/check/{user_id}/{role_name}")
def check_user_role(
    user_id: int,
    role_name: str,
    db_s: Session = Depends(db.get_db)
):
    """Проверить, есть ли у пользователя определенная роль"""
    user = db_s.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    role = db_s.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    has_role = role in user.roles
    return {"user_id": user_id, "role_name": role_name, "has_role": has_role}
